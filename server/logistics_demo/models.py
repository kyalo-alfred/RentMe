from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Courier(models.Model):
    """Available courier services for delivery"""
    COURIER_CHOICES = [
        ('BOLT', 'Bolt'),
        ('GLOVO', 'Glovo'),
        ('UBER', 'Uber'),
    ]
    
    name = models.CharField(max_length=50, choices=COURIER_CHOICES, unique=True)
    display_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def __str__(self):
        return self.display_name


class CourierAssignment(models.Model):
    """Tracks courier assignments for bookings/orders"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ASSIGNED', 'Assigned'),
        ('IN_TRANSIT', 'In Transit'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]
    
    # Reference to booking/order (flexible - can be booking_id or order_id)
    booking_id = models.CharField(max_length=100, db_index=True)
    courier = models.ForeignKey(Courier, on_delete=models.CASCADE, related_name='assignments')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='courier_assignments')
    
    # Delivery details
    pickup_address = models.TextField(blank=True)
    delivery_address = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ASSIGNED')
    
    # Timestamps
    assigned_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-assigned_at']
        indexes = [
            models.Index(fields=['booking_id', 'status']),
        ]
    
    def __str__(self):
        return f"{self.courier.display_name} - Booking {self.booking_id}"