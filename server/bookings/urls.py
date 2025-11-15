from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BookingViewSet, AvailabilityViewSet

router = DefaultRouter()
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'availability', AvailabilityViewSet, basename='availability')

urlpatterns = [
    path('', include(router.urls)),
]


