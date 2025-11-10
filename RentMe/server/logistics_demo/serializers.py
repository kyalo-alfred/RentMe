from rest_framework import serializers
from .models import Courier, CourierAssignment


class CourierSerializer(serializers.ModelSerializer):
    """Serializer for Courier model"""
    
    class Meta:
        model = Courier
        fields = ['id', 'name', 'display_name', 'description', 'is_active']
        read_only_fields = ['id']


class CourierAssignmentSerializer(serializers.ModelSerializer):
    """Serializer for CourierAssignment model"""
    courier = CourierSerializer(read_only=True)
    courier_id = serializers.PrimaryKeyRelatedField(
        queryset=Courier.objects.filter(is_active=True),
        write_only=True,
        source='courier'
    )
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = CourierAssignment
        fields = [
            'id', 'booking_id', 'courier', 'courier_id', 'user', 'user_email',
            'pickup_address', 'delivery_address', 'status', 'assigned_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'assigned_at', 'updated_at']
    
    def create(self, validated_data):
        # Set the user from the request (or use default for demo)
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        else:
            # For demo: use default user
            from accounts.models import User
            user, _ = User.objects.get_or_create(
                username='demo_user',
                defaults={'email': 'demo@rentme.com', 'is_active': True}
            )
            validated_data['user'] = user
        validated_data['status'] = 'ASSIGNED'
        return super().create(validated_data)


class CourierAssignmentCreateSerializer(serializers.Serializer):
    """Simplified serializer for creating courier assignments"""
    booking_id = serializers.CharField(max_length=100)
    courier_id = serializers.IntegerField()
    pickup_address = serializers.CharField(required=False, allow_blank=True)
    delivery_address = serializers.CharField(required=False, allow_blank=True)
