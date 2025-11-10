from django.contrib import admin
from .models import Booking, Availability


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'renter', 'listing_id', 'start_date', 'end_date', 'status', 'total_price', 'created_at']
    list_filter = ['status', 'start_date', 'created_at']
    search_fields = ['renter__username', 'renter__email', 'listing_id']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'start_date'

    fieldsets = (
        ('Booking Information', {
            'fields': ('renter', 'listing_id', 'start_date', 'end_date', 'status')
        }),
        ('Pricing', {
            'fields': ('total_price',)
        }),
        ('Additional Information', {
            'fields': ('notes', 'created_at', 'updated_at')
        }),
    )


@admin.register(Availability)
class AvailabilityAdmin(admin.ModelAdmin):
    list_display = ['id', 'listing_id', 'start_date', 'end_date', 'booking', 'reason', 'created_at']
    list_filter = ['start_date', 'end_date', 'created_at']
    search_fields = ['listing_id', 'reason']
    readonly_fields = ['created_at']
    date_hierarchy = 'start_date'


