from rest_framework import serializers
from .models import SupportCategory, SupportTicket, TicketMessage, FAQ
from accounts.serializers import UserSerializer

class SupportCategorySerializer(serializers.ModelSerializer):
    ticket_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SupportCategory
        fields = ['id', 'name', 'description', 'ticket_count', 'is_active']
    
    def get_ticket_count(self, obj):
        return obj.tickets.count()

class TicketMessageSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = TicketMessage
        fields = ['id', 'user', 'message', 'is_staff_reply', 'created_at']

class SupportTicketSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    category = SupportCategorySerializer(read_only=True)
    messages = TicketMessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = SupportTicket
        fields = ['id', 'ticket_number', 'user', 'category', 'subject', 'priority', 
                 'status', 'messages', 'created_at', 'updated_at']

class SupportTicketCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupportTicket
        fields = ['category', 'subject', 'priority']
    
    def create(self, validated_data):
        user = self.context['request'].user
        ticket = SupportTicket.objects.create(user=user, **validated_data)
        return ticket

class TicketMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicketMessage
        fields = ['message']
    
    def create(self, validated_data):
        user = self.context['request'].user
        ticket = self.context['ticket']
        
        message = TicketMessage.objects.create(
            ticket=ticket,
            user=user,
            **validated_data
        )
        
        # Update ticket status if it was closed
        if ticket.status == 'closed':
            ticket.status = 'open'
            ticket.save()
        
        return message

class FAQSerializer(serializers.ModelSerializer):
    category = SupportCategorySerializer(read_only=True)
    
    class Meta:
        model = FAQ
        fields = ['id', 'category', 'question', 'answer', 'order', 'is_active']