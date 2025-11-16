from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator
from decimal import Decimal


class Listing(models.Model):
    """
    Listing model for items available for rent.
    """
    CATEGORY_CHOICES = [
        ('Electronics', 'Electronics'),
        ('Tools', 'Tools'),
        ('Outdoor', 'Outdoor'),
        ('Sports', 'Sports'),
        ('Events', 'Events'),
        ('Vehicles', 'Vehicles'),
        ('Home & Garden', 'Home & Garden'),
        ('Photography', 'Photography'),
        ('Music', 'Music'),
        ('Other', 'Other'),
    ]

    CONDITION_CHOICES = [
        ('Brand New', 'Brand New'),
        ('Like New', 'Like New'),
        ('Good', 'Good'),
        ('Fair', 'Fair'),
        ('Acceptable', 'Acceptable'),
    ]

    PRICE_PERIOD_CHOICES = [
        ('hour', 'Per Hour'),
        ('day', 'Per Day'),
        ('week', 'Per Week'),
        ('month', 'Per Month'),
    ]

    # Owner
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings',
        help_text='User who owns this item'
    )

    # Basic Information
    title = models.CharField(max_length=200, help_text='Item title')
    description = models.TextField(help_text='Detailed description of the item')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    condition = models.CharField(max_length=20, choices=CONDITION_CHOICES)

    # Pricing
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        help_text='Rental price'
    )
    price_period = models.CharField(
        max_length=10,
        choices=PRICE_PERIOD_CHOICES,
        default='day',
        help_text='Price period (hour, day, week, month)'
    )

    # Location
    location = models.CharField(max_length=255, help_text='Item location')

    # Availability
    available_from = models.DateField(help_text='Date from which item is available')
    available_to = models.DateField(help_text='Date until which item is available')
    is_available = models.BooleanField(default=True, help_text='Is item currently available for rent?')

    # Images
    # We'll store images in a separate model for multiple images

    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    views_count = models.IntegerField(default=0, help_text='Number of times viewed')

    # Rating (calculated from reviews)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.IntegerField(default=0)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['category', 'is_available']),
            models.Index(fields=['owner', 'is_available']),
            models.Index(fields=['available_from', 'available_to']),
        ]

    def __str__(self):
        return f"{self.title} - {self.owner.username}"

    def is_available_for_dates(self, start_date, end_date):
        """Check if item is available for given date range"""
        from django.utils import timezone
        from bookings.models import Booking
        
        # Check if dates are within availability window
        if start_date < self.available_from or end_date > self.available_to:
            return False
        
        # Check if item is marked as available
        if not self.is_available:
            return False
        
        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            listing=self,
            status__in=['PENDING', 'CONFIRMED', 'ACTIVE'],
        ).filter(
            models.Q(start_date__lte=end_date) & models.Q(end_date__gte=start_date)
        )
        
        return not overlapping_bookings.exists()

    def calculate_price(self, start_date, end_date):
        """Calculate total price for given date range"""
        from datetime import timedelta
        
        days = (end_date - start_date).days + 1
        
        if self.price_period == 'hour':
            hours = days * 24
            return self.price * hours
        elif self.price_period == 'day':
            return self.price * days
        elif self.price_period == 'week':
            weeks = (days + 6) // 7  # Round up
            return self.price * weeks
        elif self.price_period == 'month':
            months = (days + 29) // 30  # Approximate
            return self.price * months
        
        return self.price * days


class ListingImage(models.Model):
    """
    Model to store multiple images for a listing.
    """
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name='images'
    )
    image = models.ImageField(upload_to='listings/')
    is_primary = models.BooleanField(default=False, help_text='Primary image for listing')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_primary', 'created_at']

    def __str__(self):
        return f"Image for {self.listing.title}"

