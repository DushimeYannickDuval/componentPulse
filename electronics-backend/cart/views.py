from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from products.models import Product
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_cart(request):
    """
    Retrieve the user's cart with all items
    """
    try:
        cart, created = Cart.objects.get_or_create(user=request.user)
        serializer = CartSerializer(cart, context={'request': request})
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error getting cart: {str(e)}")
        return Response(
            {'error': 'Failed to retrieve cart'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def add_to_cart(request):
    """
    Add item to cart or update quantity if already exists
    """
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    
    if not product_id:
        return Response(
            {'error': 'Product ID is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if quantity <= 0:
        return Response(
            {'error': 'Quantity must be positive'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        product = Product.objects.select_for_update().get(
            id=product_id, 
            is_active=True
        )
    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found or unavailable'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    try:
        cart = Cart.objects.get(user=request.user)
        
        with transaction.atomic():
            # Check stock before proceeding
            if quantity > product.stock_quantity:
                return Response(
                    {'error': 'Insufficient stock available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                new_quantity = cart_item.quantity + quantity
                if new_quantity > product.stock_quantity:
                    return Response(
                        {'error': f'Only {product.stock_quantity - cart_item.quantity} more available'},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                cart_item.quantity = new_quantity
                cart_item.save()
            
            # Refresh product stock in case of concurrent updates
            product.refresh_from_db()
            
            return Response({
                'message': 'Product added to cart successfully',
                'cart_item': CartItemSerializer(cart_item, context={'request': request}).data,
                'remaining_stock': product.stock_quantity
            })
            
    except Exception as e:
        logger.error(f"Error adding to cart: {str(e)}")
        return Response(
            {'error': 'Failed to add item to cart'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def update_cart_item(request, item_id):
    """
    Update cart item quantity or remove if quantity <= 0
    """
    quantity = int(request.data.get('quantity', 1))
    
    try:
        cart_item = CartItem.objects.select_related('product').select_for_update().get(
            id=item_id,
            cart__user=request.user
        )
        
        if quantity <= 0:
            cart_item.delete()
            return Response({'message': 'Item removed from cart'})
        
        if quantity > cart_item.product.stock_quantity:
            return Response(
                {'error': f'Only {cart_item.product.stock_quantity} available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item.quantity = quantity
        cart_item.save()
        
        return Response({
            'message': 'Cart item updated successfully',
            'cart_item': CartItemSerializer(cart_item, context={'request': request}).data,
            'remaining_stock': cart_item.product.stock_quantity
        })
        
    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Cart item not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error updating cart item: {str(e)}")
        return Response(
            {'error': 'Failed to update cart item'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_cart(request, item_id):
    """
    Remove specific item from cart
    """
    try:
        cart_item = CartItem.objects.get(
            id=item_id,
            cart__user=request.user
        )
        cart_item.delete()
        return Response({'message': 'Item removed from cart successfully'})
    except CartItem.DoesNotExist:
        return Response(
            {'error': 'Cart item not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        logger.error(f"Error removing cart item: {str(e)}")
        return Response(
            {'error': 'Failed to remove item from cart'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def clear_cart(request):
    """
    Clear all items from cart
    """
    try:
        cart = Cart.objects.get(user=request.user)
        cart.items.all().delete()
        return Response({'message': 'Cart cleared successfully'})
    except Cart.DoesNotExist:
        return Response({'message': 'Cart is already empty'})
    except Exception as e:
        logger.error(f"Error clearing cart: {str(e)}")
        return Response(
            {'error': 'Failed to clear cart'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cart_summary(request):
    """
    Get cart summary (total items, total price, etc.)
    """
    try:
        cart = Cart.objects.prefetch_related('items').get(user=request.user)
        return Response({
            'total_items': cart.total_items,
            'total_price': cart.total_price,
            'items_count': cart.items.count(),
            'discounts': 0,  # Placeholder for future discount logic
            'estimated_tax': 0  # Placeholder for tax calculation
        })
    except Cart.DoesNotExist:
        return Response({
            'total_items': 0,
            'total_price': 0,
            'items_count': 0,
            'discounts': 0,
            'estimated_tax': 0
        })
    except Exception as e:
        logger.error(f"Error getting cart summary: {str(e)}")
        return Response(
            {'error': 'Failed to get cart summary'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )