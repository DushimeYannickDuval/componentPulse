from django.contrib import admin
from .models import Payment, MobileMoneyPayment, PaymentWebhook

class MobileMoneyPaymentInline(admin.StackedInline):
    model = MobileMoneyPayment
    extra = 0
    readonly_fields = ('created_at', 'updated_at')

class PaymentWebhookInline(admin.TabularInline):
    model = PaymentWebhook
    extra = 0
    readonly_fields = ('created_at',)

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'order', 'payment_method', 'amount', 'status', 'created_at')
    list_filter = ('payment_method', 'status', 'created_at')
    search_fields = ('transaction_id', 'order__order_number', 'order__user__email')
    readonly_fields = ('transaction_id', 'created_at', 'updated_at')
    inlines = [MobileMoneyPaymentInline, PaymentWebhookInline]

@admin.register(MobileMoneyPayment)
class MobileMoneyPaymentAdmin(admin.ModelAdmin):
    list_display = ('reference_code', 'provider', 'phone_number', 'status', 'created_at')
    list_filter = ('provider', 'status', 'created_at')
    search_fields = ('reference_code', 'phone_number', 'provider_transaction_id')
    readonly_fields = ('created_at', 'updated_at')

@admin.register(PaymentWebhook)
class PaymentWebhookAdmin(admin.ModelAdmin):
    list_display = ('payment', 'provider', 'processed', 'created_at')
    list_filter = ('provider', 'processed', 'created_at')
    readonly_fields = ('created_at',)