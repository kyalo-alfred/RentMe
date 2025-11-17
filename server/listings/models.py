from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Listing(models.Model):
    """
    Basic listing for rentable items.
    """
    PERIOD_CHOICES = [
        ('hour', 'Per Hour'),
        ('day', 'Per Day'),
        ('week', 'Per Week'),
        ('month', 'Per Month'),
    ]

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100, blank=True)
    condition = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    price_period = models.CharField(
        max_length=10, choices=PERIOD_CHOICES, default='day')

    # Availability fields (to match database schema)
    available_from = models.DateField(default=timezone.now)
    available_to = models.DateField(
        default=lambda: timezone.now() + timedelta(days=365))
    is_available = models.BooleanField(default=True)

    # Statistics fields (to match database schema)
    views_count = models.IntegerField(default=0)
    average_rating = models.DecimalField(
        max_digits=3, decimal_places=2, default=0.00)
    total_reviews = models.IntegerField(default=0)

    image = models.ImageField(upload_to='listings/', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['owner', 'is_active']),
            models.Index(fields=['category']),
        ]

    def __str__(self) -> str:
        return f'{self.title} ({self.owner})'
