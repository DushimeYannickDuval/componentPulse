from rest_framework import serializers
from .models import Review
from products.serializers import ProductListSerializer
from accounts.serializers import UserSerializer

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductListSerializer(read_only=True)
    
    class Meta:
        model = Review
        fields = ['id', 'user', 'product', 'rating', 'title', 'comment', 
                 'is_verified_purchase', 'created_at', 'updated_at']

class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['product', 'rating', 'title', 'comment']
    
    def validate_rating(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5")
        return value
    
    def create(self, validated_data):
        user = self.context['request'].user
        product = validated_data['product']
        
        # Check if user already reviewed this product
        if Review.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError("You have already reviewed this product")
        
        # Check if user purchased this product (for verified purchase)
        from orders.models import OrderItem
        has_purchased = OrderItem.objects.filter(
            order__user=user,
            product=product,
            order__status='delivered'
        ).exists()
        
        review = Review.objects.create(
            user=user,
            is_verified_purchase=has_purchased,
            **validated_data
        )
        
        return review