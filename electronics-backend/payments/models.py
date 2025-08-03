from django.db import models
from django.contrib.auth import get_user_model
from orders.models import Order
import uuid

User = get_user_model()

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    PAYMENT_METHOD_CHOICES = [
        ('mtn_money', 'MTN Money'),
        ('airtel_money', 'Airtel Money'),
        ('cash_on_delivery', 'Cash on Delivery'),
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='payment')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100, unique=True)
    
    # Payment gateway response data
    gateway_response = models.JSONField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.order.order_number}"

    class Meta:
        ordering = ['-created_at']

class MobileMoneyPayment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PROVIDER_CHOICES = [
        ('mtn_money', 'MTN Money'),
        ('airtel_money', 'Airtel Money'),
    ]

    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='mobile_money')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    phone_number = models.CharField(max_length=15)
    reference_code = models.CharField(max_length=50, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Provider specific fields
    provider_transaction_id = models.CharField(max_length=100, blank=True)
    provider_reference = models.CharField(max_length=100, blank=True)
    
    # API response data
    api_response = models.JSONField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.provider} - {self.phone_number} - {self.reference_code}"

    class Meta:
        ordering = ['-created_at']

class PaymentWebhook(models.Model):
    """Store webhook data from payment providers"""
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='webhooks')
    provider = models.CharField(max_length=50)
    webhook_data = models.JSONField()
    processed = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Webhook for {self.payment.transaction_id} from {self.provider}"

    class Meta:
        ordering = ['-created_at']