from django.contrib import admin
from .models import Listing


@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
	list_display = ('id', 'title', 'owner', 'price', 'price_period', 'is_active', 'created_at')
	search_fields = ('title', 'description', 'owner__username')
	list_filter = ('is_active', 'category', 'price_period', 'created_at')


