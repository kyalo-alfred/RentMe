from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import date, timedelta
from .models import Booking, Availability

User = get_user_model()


class BookingModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_booking_creation(self):
        """Test creating a booking"""
        booking = Booking.objects.create(
            renter=self.user,
            listing_id=1,
            start_date=date.today() + timedelta(days=1),
            end_date=date.today() + timedelta(days=3),
            status='PENDING',
            total_price=100.00
        )

        self.assertEqual(booking.renter, self.user)
        self.assertEqual(booking.listing_id, 1)
        self.assertEqual(booking.status, 'PENDING')
        self.assertEqual(booking.duration_days(), 3)

    def test_booking_str(self):
        """Test booking string representation"""
        booking = Booking.objects.create(
            renter=self.user,
            listing_id=1,
            start_date=date.today() + timedelta(days=1),
            end_date=date.today() + timedelta(days=3),
            total_price=100.00
        )

        self.assertIn('Booking #', str(booking))
        self.assertIn(self.user.username, str(booking))


class AvailabilityModelTest(TestCase):
    def test_availability_creation(self):
        """Test creating an availability block"""
        availability = Availability.objects.create(
            listing_id=1,
            start_date=date.today() + timedelta(days=1),
            end_date=date.today() + timedelta(days=5),
            reason='Maintenance'
        )

        self.assertEqual(availability.listing_id, 1)
        self.assertEqual(availability.reason, 'Maintenance')

    def test_availability_overlaps(self):
        """Test availability overlap detection"""
        availability = Availability.objects.create(
            listing_id=1,
            start_date=date.today() + timedelta(days=1),
            end_date=date.today() + timedelta(days=5)
        )

        # Overlapping dates
        self.assertTrue(availability.overlaps_with(
            date.today() + timedelta(days=3),
            date.today() + timedelta(days=7)
        ))

        # Non-overlapping dates
        self.assertFalse(availability.overlaps_with(
            date.today() + timedelta(days=10),
            date.today() + timedelta(days=15)
        ))

