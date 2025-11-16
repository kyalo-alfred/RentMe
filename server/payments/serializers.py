from rest_framework import serializers
from .models import Payment
from accounts.serializers import UserSerializer
from bookings.serializers import BookingSerializer


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model"""
    payer_details = UserSerializer(source='payer', read_only=True)
    recipient_details = UserSerializer(source='recipient', read_only=True)
    booking_details = BookingSerializer(source='booking', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'booking', 'booking_details', 'payer', 'payer_details',
            'recipient', 'recipient_details', 'amount', 'currency',
            'payment_method', 'status', 'transaction_id', 'payment_reference',
            'notes', 'created_at', 'updated_at', 'completed_at'
        ]
        read_only_fields = [
            'payment_reference', 'created_at', 'updated_at', 'completed_at'
        ]


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating payments"""

    class Meta:
        model = Payment
        fields = [
            'booking', 'amount', 'currency', 'payment_method', 'notes'
        ]

    def validate(self, data):
        """Validate payment creation"""
        booking = data.get('booking')
        amount = data.get('amount')
        payer = self.context['request'].user

        if not booking:
            raise serializers.ValidationError({
                'booking': 'Booking is required'
            })

        # Verify payer is the renter
        if booking.renter != payer:
            raise serializers.ValidationError({
                'booking': 'You can only pay for your own bookings'
            })

        # Verify amount matches booking total
        if amount != booking.total_price:
            raise serializers.ValidationError({
                'amount': f'Amount must match booking total: {booking.total_price}'
            })

        # Verify booking status
        if booking.status not in ['PENDING', 'CONFIRMED']:
            raise serializers.ValidationError({
                'booking': 'Payment can only be made for pending or confirmed bookings'
            })

        # Check if payment already exists
        if Payment.objects.filter(booking=booking).exists():
            raise serializers.ValidationError({
                'booking': 'Payment already exists for this booking'
            })

        return data

    def create(self, validated_data):
        booking = validated_data['booking']
        validated_data['payer'] = self.context['request'].user
        validated_data['recipient'] = booking.listing.owner
        return super().create(validated_data)


class PaymentProcessSerializer(serializers.Serializer):
    """Serializer for processing payments"""
    transaction_id = serializers.CharField(required=True)
    payment_method = serializers.CharField(required=False)

