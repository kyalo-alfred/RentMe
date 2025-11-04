from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    
    # For RentMe specific fields
    is_verified = models.BooleanField(default=False)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.00)
    
    def __str__(self):
        return self.email or self.username
