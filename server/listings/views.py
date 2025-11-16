from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import Listing, ListingImage
from .serializers import ListingSerializer, ListingCreateSerializer
from bookings.models import Booking


class ListingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing listings.
    """
    queryset = Listing.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'condition', 'is_available', 'owner']
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'price', 'average_rating']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return ListingCreateSerializer
        return ListingSerializer

    def create(self, request, *args, **kwargs):
        """Handle listing creation with images"""
        # Check authentication
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Get images from request
        images = request.FILES.getlist('images')
        
        # Create serializer with data (excluding images)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create listing
        listing = serializer.save()
        
        # Handle images
        for index, image in enumerate(images):
            ListingImage.objects.create(
                listing=listing,
                image=image,
                is_primary=(index == 0)  # First image is primary
            )
        
        # Return full listing with images
        response_serializer = ListingSerializer(listing, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by availability dates if provided
        available_from = self.request.query_params.get('available_from', None)
        available_to = self.request.query_params.get('available_to', None)
        
        if available_from and available_to:
            # Find listings available for the date range
            queryset = queryset.filter(
                available_from__lte=available_to,
                available_to__gte=available_from,
                is_available=True
            )
            # Exclude listings with overlapping bookings
            overlapping_bookings = Booking.objects.filter(
                status__in=['PENDING', 'CONFIRMED', 'ACTIVE']
            ).filter(
                Q(start_date__lte=available_to) & Q(end_date__gte=available_from)
            )
            booked_listing_ids = overlapping_bookings.values_list('listing', flat=True)
            queryset = queryset.exclude(id__in=booked_listing_ids)
        
        return queryset.select_related('owner').prefetch_related('images')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=['views_count'])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def check_availability(self, request, pk=None):
        """Check if listing is available for given dates"""
        listing = self.get_object()
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        
        if not start_date or not end_date:
            return Response(
                {'error': 'start_date and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from datetime import datetime
            start_date = datetime.strptime(start_date, '%Y-%m-%d').date()
            end_date = datetime.strptime(end_date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Invalid date format. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        is_available = listing.is_available_for_dates(start_date, end_date)
        total_price = listing.calculate_price(start_date, end_date) if is_available else None
        
        return Response({
            'is_available': is_available,
            'total_price': str(total_price) if total_price else None,
            'start_date': start_date,
            'end_date': end_date,
        })

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_listings(self, request):
        """Get current user's listings"""
        listings = self.queryset.filter(owner=request.user)
        serializer = self.get_serializer(listings, many=True)
        return Response(serializer.data)

