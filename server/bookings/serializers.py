from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Booking, Availability

User = get_user_model()


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model"""
    renter_username = serializers.CharField(source='renter.username', read_only=True)
    renter_email = serializers.EmailField(source='renter.email', read_only=True)
    duration_days = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'renter',
            'renter_username',
            'renter_email',
            'listing_id',
            'start_date',
            'end_date',
            'status',
            'total_price',
            'notes',
            'duration_days',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['renter', 'created_at', 'updated_at']

    def validate(self, data):
        """Validate booking dates"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError({
                    'end_date': 'End date must be after start date'
                })

            from django.utils import timezone
            if start_date < timezone.now().date():
                raise serializers.ValidationError({
                    'start_date': 'Start date cannot be in the past'
                })

        return data


class AvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for Availability model"""
    booking_details = BookingSerializer(source='booking', read_only=True)

    class Meta:
        model = Availability
        fields = [
            'id',
            'listing_id',
            'start_date',
            'end_date',
            'booking',
            'booking_details',
            'reason',
            'created_at',
        ]

    def validate(self, data):
        """Validate availability dates"""
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if start_date and end_date:
            if end_date < start_date:
                raise serializers.ValidationError({
                    'end_date': 'End date must be after start date'
                })

        return data


class BookingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating bookings with availability check"""

    class Meta:
        model = Booking
        fields = [
            'listing_id',
            'start_date',
            'end_date',
            'notes',
        ]

    def validate(self, data):
        """Check if listing is available for the requested dates"""
        listing_id = data.get('listing_id')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            listing_id=listing_id,
            status__in=['PENDING', 'CONFIRMED', 'ACTIVE'],
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        if overlapping_bookings.exists():
            raise serializers.ValidationError({
                'dates': 'Listing is not available for the selected dates'
            })

        # Check for availability blocks
        overlapping_availability = Availability.objects.filter(
            listing_id=listing_id,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        if overlapping_availability.exists():
            raise serializers.ValidationError({
                'dates': 'Listing is not available for the selected dates'
            })

        return data


