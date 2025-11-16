from rest_framework import serializers
from .models import Listing, ListingImage
from accounts.serializers import UserSerializer


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['id', 'image', 'is_primary']
        read_only_fields = ['id']


class ListingSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    owner_id = serializers.IntegerField(write_only=True, required=False)
    images = ListingImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    is_available_for_rent = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id', 'owner', 'owner_id', 'title', 'description', 'category', 'condition',
            'price', 'price_period', 'location', 'available_from', 'available_to',
            'is_available', 'images', 'primary_image', 'created_at', 'updated_at',
            'views_count', 'average_rating', 'total_reviews', 'is_available_for_rent'
        ]
        read_only_fields = ['created_at', 'updated_at', 'views_count', 'average_rating', 'total_reviews']

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if primary:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(primary.image.url)
            return primary.image.url
        # Return first image if no primary
        first_image = obj.images.first()
        if first_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None

    def get_is_available_for_rent(self, obj):
        """Check if item is currently available for rent"""
        from django.utils import timezone
        today = timezone.now().date()
        return obj.is_available and obj.available_from <= today <= obj.available_to

    def create(self, validated_data):
        # Set owner from request user if not provided
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['owner'] = request.user
        return super().create(validated_data)


class ListingCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating listings with images"""
    # Images are handled separately in the view, not in serializer

    class Meta:
        model = Listing
        fields = [
            'title', 'description', 'category', 'condition', 'price', 'price_period',
            'location', 'available_from', 'available_to'
        ]

    def create(self, validated_data):
        # Images are handled separately in the view
        request = self.context.get('request')
        
        if request and request.user.is_authenticated:
            validated_data['owner'] = request.user
        
        listing = Listing.objects.create(**validated_data)
        return listing

