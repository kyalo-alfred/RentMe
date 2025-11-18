from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Listing

User = get_user_model()


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = fields


class ListingSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)
    owner_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='owner',
        write_only=True,
        required=False
    )
    image = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            'id',
            'owner',
            'owner_id',
            'title',
            'description',
            'category',
            'condition',
            'location',
            'price',
            'price_period',
            'available_from',
            'available_to',
            'is_available',
            'views_count',
            'average_rating',
            'total_reviews',
            'image',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['created_at', 'updated_at', 'owner',
                            'views_count', 'average_rating', 'total_reviews']

    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
        return None

    def create(self, validated_data):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            validated_data.setdefault('owner', request.user)
        return super().create(validated_data)
