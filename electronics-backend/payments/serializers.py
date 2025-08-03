from rest_framework import serializers
from .models import Payment, MobileMoneyPayment
from orders.serializers import OrderSerializer

class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id', 'order', 'payment_method', 'amount', 'status', 
                 'transaction_id', 'created_at', 'updated_at']

class MobileMoneyPaymentSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)
    
    class Meta:
        model = MobileMoneyPayment
        fields = ['id', 'payment', 'provider', 'phone_number', 'reference_code', 
                 'status', 'created_at']

class PaymentCreateSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    payment_method = serializers.ChoiceField(choices=[
        ('mtn_money', 'MTN Money'),
        ('airtel_money', 'Airtel Money'),
        ('cash_on_delivery', 'Cash on Delivery')
    ])
    phone_number = serializers.CharField(max_length=15, required=False)
    
    def validate(self, data):
        if data['payment_method'] in ['mtn_money', 'airtel_money'] and not data.get('phone_number'):
            raise serializers.ValidationError("Phone number is required for mobile money payments")
        return data