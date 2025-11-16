from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['payment_reference', 'payer', 'recipient', 'amount', 'currency', 'status', 'created_at']
    list_filter = ['status', 'payment_method', 'currency', 'created_at']
    search_fields = ['payment_reference', 'transaction_id', 'payer__username', 'recipient__username']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
