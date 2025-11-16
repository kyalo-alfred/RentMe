from django.urls import path
from .views import mpesa_payment, mpesa_callback

urlpatterns = [
    path('mpesa/', mpesa_payment, name='mpesa_payment'),
       path('callback/', mpesa_callback, name='mpesa_callback'),
]
