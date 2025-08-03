from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Payment, MobileMoneyPayment
from .serializers import PaymentSerializer, PaymentCreateSerializer, MobileMoneyPaymentSerializer
from orders.models import Order
import uuid
import random
import string

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_payments(request):
    payments = Payment.objects.filter(order__user=request.user).order_by('-created_at')
    serializer = PaymentSerializer(payments, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_payment(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id, order__user=request.user)
    serializer = PaymentSerializer(payment, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_payment(request):
    serializer = PaymentCreateSerializer(data=request.data)
    if serializer.is_valid():
        order_id = serializer.validated_data['order_id']
        payment_method = serializer.validated_data['payment_method']
        phone_number = serializer.validated_data.get('phone_number')
        
        try:
            order = Order.objects.get(id=order_id, user=request.user)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
        
        if order.payment_status == 'paid':
            return Response({'error': 'Order already paid'}, status=status.HTTP_400_BAD_REQUEST)
        
        with transaction.atomic():
            # Create payment record
            payment = Payment.objects.create(
                order=order,
                payment_method=payment_method,
                amount=order.total_amount,
                transaction_id=generate_transaction_id()
            )
            
            if payment_method == 'cash_on_delivery':
                # For COD, mark as pending
                payment.status = 'pending'
                order.payment_status = 'pending'
                order.save()
                payment.save()
                
                return Response({
                    'message': 'Cash on delivery payment created',
                    'payment': PaymentSerializer(payment, context={'request': request}).data
                })
            
            elif payment_method in ['mtn_money', 'airtel_money']:
                # Create mobile money payment
                mobile_payment = MobileMoneyPayment.objects.create(
                    payment=payment,
                    provider=payment_method,
                    phone_number=phone_number,
                    reference_code=generate_reference_code()
                )
                
                # Simulate mobile money API call
                success = simulate_mobile_money_payment(payment_method, phone_number, order.total_amount)
                
                if success:
                    payment.status = 'completed'
                    mobile_payment.status = 'completed'
                    order.payment_status = 'paid'
                    order.status = 'confirmed'
                else:
                    payment.status = 'failed'
                    mobile_payment.status = 'failed'
                
                payment.save()
                mobile_payment.save()
                order.save()
                
                return Response({
                    'message': 'Mobile money payment processed',
                    'payment': PaymentSerializer(payment, context={'request': request}).data,
                    'mobile_payment': MobileMoneyPaymentSerializer(mobile_payment, context={'request': request}).data
                })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_payment(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id, order__user=request.user)
    
    if payment.payment_method == 'cash_on_delivery':
        return Response({'error': 'COD payments cannot be verified online'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Simulate payment verification
    if payment.status == 'pending':
        # In real implementation, you would call the payment provider's API
        success = random.choice([True, False])  # Simulate verification result
        
        if success:
            payment.status = 'completed'
            payment.order.payment_status = 'paid'
            payment.order.status = 'confirmed'
            payment.order.save()
        else:
            payment.status = 'failed'
        
        payment.save()
    
    return Response({
        'message': 'Payment verification completed',
        'payment': PaymentSerializer(payment, context={'request': request}).data
    })

def generate_transaction_id():
    """Generate a unique transaction ID"""
    return f"TXN-{uuid.uuid4().hex[:12].upper()}"

def generate_reference_code():
    """Generate a reference code for mobile money"""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))

def simulate_mobile_money_payment(provider, phone_number, amount):
    """Simulate mobile money payment API call"""
    # In real implementation, you would integrate with actual mobile money APIs
    # For now, we'll simulate with 80% success rate
    return random.random() < 0.8

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def payment_methods(request):
    """Get available payment methods"""
    methods = [
        {
            'code': 'mtn_money',
            'name': 'MTN Money',
            'description': 'Pay using MTN Mobile Money',
            'requires_phone': True
        },
        {
            'code': 'airtel_money',
            'name': 'Airtel Money',
            'description': 'Pay using Airtel Money',
            'requires_phone': True
        },
        {
            'code': 'cash_on_delivery',
            'name': 'Cash on Delivery',
            'description': 'Pay when your order is delivered',
            'requires_phone': False
        }
    ]
    return Response(methods)