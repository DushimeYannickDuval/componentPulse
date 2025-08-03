from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Count
from .models import SupportCategory, SupportTicket, TicketMessage, FAQ
from .serializers import (SupportCategorySerializer, SupportTicketSerializer, 
                         SupportTicketCreateSerializer, TicketMessageSerializer,
                         TicketMessageCreateSerializer, FAQSerializer)

@api_view(['GET'])
def get_support_categories(request):
    categories = SupportCategory.objects.filter(is_active=True)
    serializer = SupportCategorySerializer(categories, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def get_faqs(request):
    faqs = FAQ.objects.filter(is_active=True).order_by('category', 'order')
    
    # Filter by category
    category_id = request.GET.get('category')
    if category_id:
        faqs = faqs.filter(category_id=category_id)
    
    # Search
    search = request.GET.get('search')
    if search:
        faqs = faqs.filter(question__icontains=search)
    
    serializer = FAQSerializer(faqs, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_tickets(request):
    tickets = SupportTicket.objects.filter(user=request.user).order_by('-created_at')
    
    # Filter by status
    status_filter = request.GET.get('status')
    if status_filter:
        tickets = tickets.filter(status=status_filter)
    
    serializer = SupportTicketSerializer(tickets, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_ticket(request, ticket_id):
    ticket = get_object_or_404(SupportTicket, id=ticket_id, user=request.user)
    serializer = SupportTicketSerializer(ticket, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_ticket(request):
    serializer = SupportTicketCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        ticket = serializer.save()
        
        # Create initial message if provided
        initial_message = request.data.get('message')
        if initial_message:
            TicketMessage.objects.create(
                ticket=ticket,
                user=request.user,
                message=initial_message
            )
        
        return Response({
            'message': 'Support ticket created successfully',
            'ticket': SupportTicketSerializer(ticket, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_ticket_message(request, ticket_id):
    ticket = get_object_or_404(SupportTicket, id=ticket_id, user=request.user)
    
    if ticket.status == 'closed':
        return Response({'error': 'Cannot add message to closed ticket'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    serializer = TicketMessageCreateSerializer(
        data=request.data, 
        context={'request': request, 'ticket': ticket}
    )
    
    if serializer.is_valid():
        message = serializer.save()
        return Response({
            'message': 'Message added successfully',
            'ticket_message': TicketMessageSerializer(message, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_ticket_status(request, ticket_id):
    ticket = get_object_or_404(SupportTicket, id=ticket_id, user=request.user)
    
    new_status = request.data.get('status')
    allowed_statuses = ['closed']  # Users can only close tickets
    
    if new_status not in allowed_statuses:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    ticket.status = new_status
    ticket.save()
    
    return Response({
        'message': 'Ticket status updated',
        'ticket': SupportTicketSerializer(ticket, context={'request': request}).data
    })

@api_view(['GET'])
def support_summary(request):
    """Get support system statistics"""
    total_tickets = SupportTicket.objects.count()
    open_tickets = SupportTicket.objects.filter(status='open').count()
    closed_tickets = SupportTicket.objects.filter(status='closed').count()
    total_faqs = FAQ.objects.filter(is_active=True).count()
    
    # Ticket distribution by category
    category_stats = SupportCategory.objects.annotate(
        ticket_count=Count('tickets')
    ).filter(is_active=True)
    
    return Response({
        'total_tickets': total_tickets,
        'open_tickets': open_tickets,
        'closed_tickets': closed_tickets,
        'total_faqs': total_faqs,
        'category_stats': [
            {
                'category': cat.name,
                'ticket_count': cat.ticket_count
            }
            for cat in category_stats
        ]
    })

@api_view(['GET'])
def contact_info(request):
    """Get contact information"""
    return Response({
        'email': 'support@electronicsshop.ug',
        'phone': '+256 700 123 456',
        'whatsapp': '+256 700 123 456',
        'address': 'Kampala, Uganda',
        'business_hours': 'Monday - Friday: 8:00 AM - 6:00 PM',
        'response_time': '24 hours for general inquiries, 4 hours for urgent issues'
    })