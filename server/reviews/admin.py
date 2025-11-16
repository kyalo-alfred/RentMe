from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ['id', 'reviewer', 'review_type', 'rating', 'listing', 'reviewee', 'created_at']
    list_filter = ['review_type', 'rating', 'is_visible', 'created_at']
    search_fields = ['title', 'comment', 'reviewer__username', 'reviewee__username']
    readonly_fields = ['created_at', 'updated_at']
