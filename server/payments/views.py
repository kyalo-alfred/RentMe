from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from django.utils import timezone
from .models import Payment
from .serializers import PaymentSerializer, PaymentCreateSerializer, PaymentProcessSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing payments.
    """
    queryset = Payment.objects.all()
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_method', 'payer', 'recipient']
    search_fields = ['payment_reference', 'transaction_id']
    ordering_fields = ['created_at', 'amount']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        elif self.action == 'process':
            return PaymentProcessSerializer
        return PaymentSerializer

    def get_queryset(self):
        """Filter to show only user's payments"""
        user = self.request.user
        return self.queryset.filter(
            models.Q(payer=user) | models.Q(recipient=user)
        )

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def process(self, request, pk=None):
        """
        Process a payment (simulate payment gateway).
        In production, this would integrate with actual payment gateways.
        """
        payment = self.get_object()
        
        # Verify user is the payer
        if payment.payer != request.user:
            return Response(
                {'error': 'You can only process your own payments'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PaymentProcessSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        transaction_id = serializer.validated_data['transaction_id']

        # Simulate payment processing
        # In production, this would call payment gateway API
        payment.status = 'PROCESSING'
        payment.transaction_id = transaction_id
        payment.save()

        # Simulate successful payment after processing
        # In production, this would be handled by webhook from payment gateway
        payment.status = 'COMPLETED'
        payment.completed_at = timezone.now()
        payment.save()

        # Update booking status
        booking = payment.booking
        if booking.status == 'PENDING':
            booking.status = 'CONFIRMED'
            booking.save()

        serializer = PaymentSerializer(payment)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_payments(self, request):
        """Get current user's payments"""
        payments = self.queryset.filter(payer=request.user)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def received_payments(self, request):
        """Get payments received by current user"""
        payments = self.queryset.filter(recipient=request.user)
        serializer = self.get_serializer(payments, many=True)
        return Response(serializer.data)
