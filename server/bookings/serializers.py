from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Booking, Availability

User = get_user_model()


class BookingSerializer(serializers.ModelSerializer):
    """Serializer for Booking model"""
    renter_username = serializers.CharField(
        source='renter.username', read_only=True)
    renter_email = serializers.EmailField(
        source='renter.email', read_only=True)
    listing_title = serializers.CharField(
        source='listing.title', read_only=True)
    duration_days = serializers.IntegerField(read_only=True)
    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'renter',
            'renter_username',
            'renter_email',
            'listing',
            'listing_title',
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
    listing_title = serializers.CharField(
        source='listing.title', read_only=True)

    class Meta:
        model = Availability
        fields = [
            'id',
            'listing',
            'listing_title',
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
            'listing',
            'start_date',
            'end_date',
            'notes',
        ]

    def validate(self, data):
        """Check if listing is available for the requested dates"""
        listing = data.get('listing')
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        # Validate dates
        if end_date < start_date:
            raise serializers.ValidationError({
                'end_date': 'End date must be after start date'
            })

        from django.utils import timezone
        if start_date < timezone.now().date():
            raise serializers.ValidationError({
                'start_date': 'Start date cannot be in the past'
            })

        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            listing=listing,
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
            listing=listing,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        if overlapping_availability.exists():
            raise serializers.ValidationError({
                'dates': 'Listing is not available for the selected dates'
            })

        return data

    def create(self, validated_data):
        """Calculate total price and create booking"""
        listing = validated_data['listing']
        start_date = validated_data['start_date']
        end_date = validated_data['end_date']

        # Calculate duration in days
        duration_days = (end_date - start_date).days + 1

        # Calculate total price based on listing's price_period
        price = listing.price
        price_period = listing.price_period

        if price_period == 'hour':
            # Assume 8 hours per day for hourly rentals
            total_price = price * duration_days * 8
        elif price_period == 'day':
            total_price = price * duration_days
        elif price_period == 'week':
            # Convert to weeks, rounding up
            weeks = (duration_days + 6) // 7
            total_price = price * weeks
        elif price_period == 'month':
            # Convert to months, rounding up
            months = (duration_days + 29) // 30
            total_price = price * months
        else:
            # Default to daily rate
            total_price = price * duration_days

        validated_data['total_price'] = total_price

        return super().create(validated_data)
