from django.contrib import admin
from .models import Courier, CourierAssignment


@admin.register(Courier)
class CourierAdmin(admin.ModelAdmin):
    list_display = ['display_name', 'name', 'is_active', 'created_at']
    list_filter = ['is_active', 'name']
    search_fields = ['display_name', 'name']
    readonly_fields = ['created_at']


@admin.register(CourierAssignment)
class CourierAssignmentAdmin(admin.ModelAdmin):
    list_display = ['booking_id', 'courier', 'user', 'status', 'assigned_at']
    list_filter = ['status', 'courier', 'assigned_at']
    search_fields = ['booking_id', 'user__email', 'user__username']
    readonly_fields = ['assigned_at', 'updated_at']
    raw_id_fields = ['user', 'courier']