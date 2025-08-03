from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['name', 'quantity', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'id',
            'customer',  # FK to User model
            'payment_method',
            'shipping_method',
            'total_amount',
            'items',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'total_amount']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        customer = validated_data.pop('customer')

        order = Order.objects.create(customer=customer, **validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        total = sum(item['price'] * item['quantity'] for item in items_data)
        shipping_costs = {'standard': 5000, 'express': 15000}
        shipping_cost = shipping_costs.get(order.shipping_method, 5000)
        order.total_amount = total + shipping_cost
        order.save()

        # Optionally, send order confirmation email here or override save method
        self.send_order_confirmation_email(order)

        return order

    def send_order_confirmation_email(self, order):
        from django.core.mail import send_mail
        from django.conf import settings

        customer = order.customer
        subject = f"Order Confirmation - #{order.id}"

        item_lines = [
            f" - {item.name} (x{item.quantity}) @ UGX {item.price} = UGX {item.quantity * item.price}"
            for item in order.items.all()
        ]
        items_text = "\n".join(item_lines)

        message = f"""
Hi {customer.first_name},

🎉 Thank you for your order #{order.id}!

Shipping Method: {order.get_shipping_method_display()}
Payment Method: {order.get_payment_method_display()}

Items:
{items_text}

Total: UGX {order.total_amount}

We will notify you when your order ships.

Thank you for shopping with componentPulse!
"""

        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [customer.email],
            fail_silently=False,
        )
