from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

# API Root View
def api_root(request):
    return JsonResponse({
        'message': 'Welcome to componentPulse API',
        'version': '1.0',
        'endpoints': {
            'products': '/api/products/',
            'featured_products': '/api/products/featured/',
            'categories': '/api/products/categories/',
            'deals': '/api/deals/',
            'cart': '/api/cart/',
            'orders': '/api/orders/',
            'payments': '/api/payments/',
            'training': '/api/training/',
            'support': '/api/support/',
            'admin': '/admin/'
        }
    })

urlpatterns = [
    path('', api_root, name='api_root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/deals/', include('deals.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/training/', include('training.urls')),
    path('api/support/', include('support.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Admin branding
admin.site.site_header = "componentPulse Store Admin"
admin.site.site_title = "componentPulse Store"
admin.site.index_title = "Welcome to componentPulse Store Administration"
