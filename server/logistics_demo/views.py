from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Courier, CourierAssignment
from .serializers import (
    CourierSerializer,
    CourierAssignmentSerializer,
    CourierAssignmentCreateSerializer
)


class CourierViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing available courier services"""
    queryset = Courier.objects.filter(is_active=True)
    serializer_class = CourierSerializer
    permission_classes = []  # Allow unauthenticated access for demo
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        """Get all available courier services"""
        couriers = Courier.objects.filter(is_active=True)
        serializer = self.get_serializer(couriers, many=True)
        return Response(serializer.data)


class CourierAssignmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing courier assignments"""
    queryset = CourierAssignment.objects.all()
    serializer_class = CourierAssignmentSerializer
    permission_classes = []  # Allow unauthenticated access for demo
    
    def get_queryset(self):
        """Filter assignments to only show current user's assignments"""
        if self.request.user.is_authenticated:
            return CourierAssignment.objects.filter(user=self.request.user)
        # For demo: return all assignments if not authenticated
        return CourierAssignment.objects.all()
    
    def create(self, request, *args, **kwargs):
        """Create a new courier assignment"""
        create_serializer = CourierAssignmentCreateSerializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        
        # Get the courier
        courier = get_object_or_404(
            Courier,
            id=create_serializer.validated_data['courier_id'],
            is_active=True
        )
        
        # Get or create a default user for demo (if not authenticated)
        user = request.user if request.user.is_authenticated else None
        if not user:
            # For demo: create or get a default user
            from accounts.models import User
            user, _ = User.objects.get_or_create(
                username='demo_user',
                defaults={'email': 'demo@rentme.com', 'is_active': True}
            )
        
        # Check if assignment already exists for this booking
        existing = CourierAssignment.objects.filter(
            booking_id=create_serializer.validated_data['booking_id'],
            user=user
        ).first()
        
        if existing:
            # Update existing assignment
            existing.courier = courier
            existing.pickup_address = create_serializer.validated_data.get('pickup_address', '')
            existing.delivery_address = create_serializer.validated_data.get('delivery_address', '')
            existing.status = 'ASSIGNED'
            existing.save()
            serializer = CourierAssignmentSerializer(existing, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        # Create new assignment
        assignment = CourierAssignment.objects.create(
            booking_id=create_serializer.validated_data['booking_id'],
            courier=courier,
            user=user,
            pickup_address=create_serializer.validated_data.get('pickup_address', ''),
            delivery_address=create_serializer.validated_data.get('delivery_address', ''),
            status='ASSIGNED'
        )
        
        serializer = CourierAssignmentSerializer(assignment, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'])
    def by_booking(self, request):
        """Get courier assignment by booking_id"""
        booking_id = request.query_params.get('booking_id')
        if not booking_id:
            return Response(
                {'error': 'booking_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # For demo: allow access without authentication
        user = request.user if request.user.is_authenticated else None
        if user:
            assignment = CourierAssignment.objects.filter(
                booking_id=booking_id,
                user=user
            ).first()
        else:
            assignment = CourierAssignment.objects.filter(
                booking_id=booking_id
            ).first()
        
        if not assignment:
            return Response(
                {'message': 'No courier assigned for this booking'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = CourierAssignmentSerializer(assignment, context={'request': request})
        return Response(serializer.data)