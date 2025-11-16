from rest_framework import serializers
from .models import Review
from accounts.serializers import UserSerializer
from listings.serializers import ListingSerializer
from bookings.serializers import BookingSerializer


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer for Review model"""
    reviewer_details = UserSerializer(source='reviewer', read_only=True)
    reviewee_details = UserSerializer(source='reviewee', read_only=True)
    listing_details = ListingSerializer(source='listing', read_only=True)
    booking_details = BookingSerializer(source='booking', read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'reviewer', 'reviewer_details', 'reviewee', 'reviewee_details',
            'listing', 'listing_details', 'booking', 'booking_details',
            'review_type', 'rating', 'title', 'comment',
            'created_at', 'updated_at', 'is_visible'
        ]
        read_only_fields = ['created_at', 'updated_at']

    def validate(self, data):
        """Validate review data"""
        review_type = data.get('review_type')
        listing = data.get('listing')
        reviewee = data.get('reviewee')
        booking = data.get('booking')

        if review_type == 'item':
            if not listing:
                raise serializers.ValidationError({
                    'listing': 'Listing is required for item reviews'
                })
        elif review_type in ['owner', 'renter']:
            if not reviewee:
                raise serializers.ValidationError({
                    'reviewee': 'Reviewee is required for owner/renter reviews'
                })
            if not booking:
                raise serializers.ValidationError({
                    'booking': 'Booking is required for owner/renter reviews'
                })

        return data


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating reviews"""

    class Meta:
        model = Review
        fields = [
            'listing', 'booking', 'reviewee', 'review_type',
            'rating', 'title', 'comment'
        ]

    def validate(self, data):
        """Validate review creation"""
        review_type = data.get('review_type')
        reviewer = self.context['request'].user
        booking = data.get('booking')

        # Check if user has already reviewed this booking for this type
        if booking:
            existing_review = Review.objects.filter(
                reviewer=reviewer,
                booking=booking,
                review_type=review_type
            ).exists()
            if existing_review:
                raise serializers.ValidationError({
                    'review': 'You have already reviewed this booking'
                })

            # Verify user is part of the booking
            if review_type == 'owner':
                # Renter reviews owner
                if booking.renter != reviewer:
                    raise serializers.ValidationError({
                        'booking': 'You can only review bookings you made'
                    })
            elif review_type == 'renter':
                # Owner reviews renter
                if booking.listing.owner != reviewer:
                    raise serializers.ValidationError({
                        'booking': 'You can only review bookings for your listings'
                    })

        return data

    def create(self, validated_data):
        validated_data['reviewer'] = self.context['request'].user
        return super().create(validated_data)

