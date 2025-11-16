from django.contrib import admin
from .models import Listing, ListingImage


class ListingImageInline(admin.TabularInline):
    model = ListingImage
    extra = 1


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ['title', 'owner', 'category', 'price', 'price_period', 'is_available', 'created_at']
    list_filter = ['category', 'condition', 'is_available', 'created_at']
    search_fields = ['title', 'description', 'owner__username', 'owner__email']
    inlines = [ListingImageInline]
    readonly_fields = ['created_at', 'updated_at', 'views_count', 'average_rating', 'total_reviews']


@admin.register(ListingImage)
class ListingImageAdmin(admin.ModelAdmin):
    list_display = ['listing', 'is_primary', 'created_at']
    list_filter = ['is_primary', 'created_at']

