from django.db import models
from django.conf import settings
from django.utils import timezone


# Note: This assumes a 'listings' app will be created by Member 2
# If the Listing model is in a different app, update the import below
# For now, we'll use a ForeignKey with 'listings.Listing' - adjust when listings app is created

class Booking(models.Model):
    """
    Booking model to track item rentals.
    Links a user (renter) to a listing with rental dates and status.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]

    # Relationships
    renter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text='User who is renting the item'
    )
    listing = models.ForeignKey(
        'listings.Listing',
        on_delete=models.CASCADE,
        related_name='bookings',
        help_text='Item being rented',
        null=True,
        blank=True
    )

    # Booking dates
    start_date = models.DateField(help_text='Rental start date')
    end_date = models.DateField(help_text='Rental end date')

    # Booking details
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING',
        help_text='Current status of the booking'
    )
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Total rental price for the period'
    )

    # Additional information
    notes = models.TextField(blank=True, null=True, help_text='Additional notes from renter')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['listing', 'start_date', 'end_date']),
            models.Index(fields=['renter', 'status']),
        ]

    def __str__(self):
        return f"Booking #{self.id} - {self.renter.username} - {self.status}"

    def is_active(self):
        """Check if booking is currently active"""
        today = timezone.now().date()
        return self.status == 'ACTIVE' and self.start_date <= today <= self.end_date

    def duration_days(self):
        """Calculate rental duration in days"""
        return (self.end_date - self.start_date).days + 1


class Availability(models.Model):
    """
    Availability model to track when listings are available/unavailable.
    This helps prevent double bookings and manage rental calendars.
    """
    listing = models.ForeignKey(
        'listings.Listing',
        on_delete=models.CASCADE,
        related_name='availability',
        help_text='Listing this availability block is for',
        null=True,
        blank=True
    )

    # Availability period
    start_date = models.DateField(help_text='Start of unavailable period')
    end_date = models.DateField(help_text='End of unavailable period')

    # Reference to booking (if blocked by a booking)
    booking = models.ForeignKey(
        'Booking',
        on_delete=models.CASCADE,
        related_name='availability_blocks',
        blank=True,
        null=True,
        help_text='Booking that blocks this period (if applicable)'
    )

    # Additional info
    reason = models.CharField(
        max_length=100,
        blank=True,
        help_text='Reason for unavailability (e.g., "Booked", "Maintenance")'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'Availabilities'
        ordering = ['start_date', 'end_date']
        indexes = [
            models.Index(fields=['listing', 'start_date', 'end_date']),
        ]

    def __str__(self):
        return f"Availability block for {self.listing.title} - {self.start_date} to {self.end_date}"

    def overlaps_with(self, start_date, end_date):
        """Check if this availability block overlaps with given dates"""
        return not (self.end_date < start_date or self.start_date > end_date)


