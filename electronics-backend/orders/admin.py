from django.contrib import admin
from .models import Customer, Order, OrderItem

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['first_name', 'last_name', 'email', 'phone', 'city', 'location']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'created_at', 'payment_method', 'shipping_method', 'total_amount']
    list_filter = ['created_at', 'payment_method', 'shipping_method']
    search_fields = ['customer__first_name', 'customer__last_name']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'name', 'quantity', 'price']
