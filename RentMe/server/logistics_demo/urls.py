from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CourierViewSet, CourierAssignmentViewSet

router = DefaultRouter()
router.register(r'couriers', CourierViewSet, basename='courier')
router.register(r'assignments', CourierAssignmentViewSet, basename='courier-assignment')

urlpatterns = router.urls
