from django.urls import path
from . import views

urlpatterns = [
    path('categories/', views.get_support_categories, name='get_support_categories'),
    path('faqs/', views.get_faqs, name='get_faqs'),
    path('tickets/', views.get_tickets, name='get_tickets'),
    path('tickets/create/', views.create_ticket, name='create_ticket'),
    path('tickets/<int:ticket_id>/', views.get_ticket, name='get_ticket'),
    path('tickets/<int:ticket_id>/messages/', views.add_ticket_message, name='add_ticket_message'),
    path('tickets/<int:ticket_id>/status/', views.update_ticket_status, name='update_ticket_status'),
    path('summary/', views.support_summary, name='support_summary'),
    path('contact/', views.contact_info, name='contact_info'),
]