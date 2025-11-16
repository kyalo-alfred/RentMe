from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import Booking, Availability
from .serializers import (
    BookingSerializer,
    AvailabilitySerializer,
    BookingCreateSerializer
)


class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing bookings.
    Provides CRUD operations and search/filter functionality.
    """
    queryset = Booking.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'listing', 'renter']
    search_fields = ['renter__username', 'renter__email', 'notes']
    ordering_fields = ['created_at', 'start_date', 'total_price']
    ordering = ['-created_at']

    def get_serializer_class(self):
        """Use different serializer for create vs retrieve/update"""
        if self.action == 'create':
            return BookingCreateSerializer
        return BookingSerializer

    def perform_create(self, serializer):
        """Set the renter to the current user when creating a booking"""
        serializer.save(renter=self.request.user)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search bookings by various criteria.
        Endpoint: GET /api/bookings/search/?query=search_term&status=CONFIRMED
        """
        query = request.query_params.get('query', '')
        status_filter = request.query_params.get('status', '')
        listing_id = request.query_params.get('listing_id', '')
        start_date = request.query_params.get('start_date', '')
        end_date = request.query_params.get('end_date', '')

        bookings = self.queryset

        # Search by query string
        if query:
            bookings = bookings.filter(
                Q(renter__username__icontains=query) |
                Q(renter__email__icontains=query) |
                Q(notes__icontains=query)
            )

        # Filter by status
        if status_filter:
            bookings = bookings.filter(status=status_filter)

        # Filter by listing
        listing_id = request.query_params.get('listing_id', '')
        if listing_id:
            bookings = bookings.filter(listing_id=listing_id)

        # Filter by date range
        if start_date:
            bookings = bookings.filter(start_date__gte=start_date)
        if end_date:
            bookings = bookings.filter(end_date__lte=end_date)

        # Only show user's own bookings if not admin
        if not request.user.is_staff:
            bookings = bookings.filter(renter=request.user)

        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_bookings(self, request):
        """
        Get current user's bookings.
        Endpoint: GET /api/bookings/my_bookings/
        """
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        bookings = self.queryset.filter(renter=request.user)
        serializer = self.get_serializer(bookings, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel a booking.
        Endpoint: POST /api/bookings/{id}/cancel/
        """
        booking = self.get_object()

        # Check if user owns the booking
        if booking.renter != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'You do not have permission to cancel this booking'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if booking can be cancelled
        if booking.status in ['COMPLETED', 'CANCELLED']:
            return Response(
                {'detail': f'Booking is already {booking.status.lower()}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'CANCELLED'
        booking.save()

        serializer = self.get_serializer(booking)
        return Response(serializer.data)


class AvailabilityViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing listing availability.
    """
    queryset = Availability.objects.all()
    serializer_class = AvailabilitySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['listing']
    ordering_fields = ['start_date', 'end_date']
    ordering = ['start_date']

    @action(detail=False, methods=['get'], permission_classes=[AllowAny])
    def check_availability(self, request):
        """
        Check if a listing is available for given dates.
        Endpoint: GET /api/bookings/availability/check/?listing_id=1&start_date=2024-01-01&end_date=2024-01-05
        Public endpoint - no authentication required for checking availability
        """
        listing_id = request.query_params.get('listing_id')
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')

        if not all([listing_id, start_date, end_date]):
            return Response(
                {'detail': 'listing_id, start_date, and end_date are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from listings.models import Listing
        try:
            listing = Listing.objects.get(id=listing_id)
        except Listing.DoesNotExist:
            return Response(
                {'detail': 'Listing not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check for overlapping bookings
        overlapping_bookings = Booking.objects.filter(
            listing=listing,
            status__in=['PENDING', 'CONFIRMED', 'ACTIVE'],
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        # Check for availability blocks
        overlapping_availability = Availability.objects.filter(
            listing=listing,
            start_date__lte=end_date,
            end_date__gte=start_date
        )

        is_available = not overlapping_bookings.exists() and not overlapping_availability.exists()

        return Response({
            'available': is_available,
            'listing_id': listing_id,
            'start_date': start_date,
            'end_date': end_date,
            'conflicts': {
                'bookings': overlapping_bookings.count(),
                'availability_blocks': overlapping_availability.count()
            },
            'total_price': str(listing.calculate_price(
                start_date, end_date
            )) if is_available else None
        })


