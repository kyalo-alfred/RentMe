from django.db import models
from django.conf import settings
from decimal import Decimal


class Payment(models.Model):
    """
    Payment model for rental transactions.
    """
    PAYMENT_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
        ('CANCELLED', 'Cancelled'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('CARD', 'Credit/Debit Card'),
        ('MPESA', 'M-Pesa'),
        ('PAYPAL', 'PayPal'),
        ('BANK_TRANSFER', 'Bank Transfer'),
        ('OTHER', 'Other'),
    ]

    # Relationships
    booking = models.OneToOneField(
        'bookings.Booking',
        on_delete=models.CASCADE,
        related_name='payment',
        help_text='Booking this payment is for'
    )
    payer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments_made',
        help_text='User making the payment'
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='payments_received',
        help_text='User receiving the payment'
    )

    # Payment details
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text='Payment amount'
    )
    currency = models.CharField(max_length=3, default='KES', help_text='Currency code')
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='CARD',
        help_text='Payment method used'
    )
    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='PENDING',
        help_text='Payment status'
    )

    # Transaction details
    transaction_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text='External transaction ID from payment gateway'
    )
    payment_reference = models.CharField(
        max_length=255,
        unique=True,
        help_text='Internal payment reference'
    )

    # Metadata
    notes = models.TextField(blank=True, help_text='Additional payment notes')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    completed_at = models.DateTimeField(null=True, blank=True, help_text='When payment was completed')

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payer', 'status']),
            models.Index(fields=['recipient', 'status']),
            models.Index(fields=['booking']),
            models.Index(fields=['transaction_id']),
            models.Index(fields=['payment_reference']),
        ]

    def __str__(self):
        return f"Payment #{self.payment_reference} - {self.amount} {self.currency} - {self.status}"

    def save(self, *args, **kwargs):
        if not self.payment_reference:
            import uuid
            self.payment_reference = f"PAY-{uuid.uuid4().hex[:12].upper()}"
        super().save(*args, **kwargs)
