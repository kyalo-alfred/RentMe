from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator


class Review(models.Model):
    """
    Review model for items, owners, and renters.
    """
    REVIEW_TYPE_CHOICES = [
        ('item', 'Item Review'),
        ('owner', 'Owner Review'),
        ('renter', 'Renter Review'),
    ]

    # Review details
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_given',
        help_text='User who wrote the review'
    )
    reviewee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews_received',
        help_text='User being reviewed (for owner/renter reviews)',
        null=True,
        blank=True
    )
    
    # Related objects
    listing = models.ForeignKey(
        'listings.Listing',
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text='Item being reviewed',
        null=True,
        blank=True
    )
    booking = models.ForeignKey(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='reviews',
        help_text='Booking this review is for',
        null=True,
        blank=True
    )

    # Review type
    review_type = models.CharField(
        max_length=10,
        choices=REVIEW_TYPE_CHOICES,
        help_text='Type of review'
    )

    # Rating and content
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text='Rating from 1 to 5'
    )
    title = models.CharField(max_length=200, blank=True, help_text='Review title')
    comment = models.TextField(help_text='Review comment')

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_visible = models.BooleanField(default=True, help_text='Is review visible to others?')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['review_type', 'listing']),
            models.Index(fields=['reviewer', 'reviewee']),
            models.Index(fields=['booking']),
        ]
        unique_together = [
            ['reviewer', 'booking', 'review_type'],  # One review per booking per type
        ]

    def __str__(self):
        if self.review_type == 'item':
            return f"Item Review for {self.listing.title} by {self.reviewer.username}"
        elif self.review_type == 'owner':
            return f"Owner Review for {self.reviewee.username} by {self.reviewer.username}"
        else:
            return f"Renter Review for {self.reviewee.username} by {self.reviewer.username}"

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        super().save(*args, **kwargs)
        # Update ratings when review is saved
        if is_new or 'rating' in kwargs.get('update_fields', []):
            self.update_ratings()

    def update_ratings(self):
        """Update ratings for related objects"""
        from django.db.models import Avg
        
        if self.review_type == 'item' and self.listing:
            # Update listing rating
            reviews = Review.objects.filter(
                listing=self.listing,
                review_type='item',
                is_visible=True
            )
            if reviews.exists():
                avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
                self.listing.average_rating = round(avg_rating, 2)
                self.listing.total_reviews = reviews.count()
                self.listing.save(update_fields=['average_rating', 'total_reviews'])

        elif self.review_type in ['owner', 'renter'] and self.reviewee:
            # Update user rating
            reviews = Review.objects.filter(
                reviewee=self.reviewee,
                review_type=self.review_type,
                is_visible=True
            )
            if reviews.exists():
                avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
                self.reviewee.rating = round(avg_rating, 2)
                self.reviewee.total_ratings = reviews.count()
                self.reviewee.save(update_fields=['rating', 'total_ratings'])
