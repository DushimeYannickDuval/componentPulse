from django.urls import path
from . import views

urlpatterns = [
    path('', views.get_payments, name='get_payments'),
    path('create/', views.create_payment, name='create_payment'),
    path('<int:payment_id>/', views.get_payment, name='get_payment'),
    path('<int:payment_id>/verify/', views.verify_payment, name='verify_payment'),
    path('methods/', views.payment_methods, name='payment_methods'),
]