from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer
from products.models import Product

@api_view(['GET'])
def get_product_reviews(request, product_id):
    try:
        product = Product.objects.get(id=product_id, is_active=True)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    
    reviews = Review.objects.filter(product=product).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    
    # Calculate review statistics
    stats = reviews.aggregate(
        average_rating=Avg('rating'),
        total_reviews=Count('id')
    )
    
    rating_distribution = {}
    for i in range(1, 6):
        rating_distribution[f'{i}_star'] = reviews.filter(rating=i).count()
    
    return Response({
        'reviews': serializer.data,
        'statistics': {
            'average_rating': round(stats['average_rating'] or 0, 1),
            'total_reviews': stats['total_reviews'],
            'rating_distribution': rating_distribution
        }
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_reviews(request):
    reviews = Review.objects.filter(user=request.user).order_by('-created_at')
    serializer = ReviewSerializer(reviews, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_review(request):
    serializer = ReviewCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        review = serializer.save()
        return Response({
            'message': 'Review created successfully',
            'review': ReviewSerializer(review, context={'request': request}).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([permissions.IsAuthenticated])
def review_detail(request, review_id):
    review = get_object_or_404(Review, id=review_id, user=request.user)
    
    if request.method == 'GET':
        serializer = ReviewSerializer(review, context={'request': request})
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = ReviewCreateSerializer(review, data=request.data, partial=True, 
                                          context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Review updated successfully',
                'review': ReviewSerializer(review, context={'request': request}).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        review.delete()
        return Response({'message': 'Review deleted successfully'})

@api_view(['GET'])
def review_summary(request):
    """Get overall review statistics"""
    total_reviews = Review.objects.count()
    average_rating = Review.objects.aggregate(avg_rating=Avg('rating'))['avg_rating']
    
    # Top rated products
    from django.db.models import Count
    top_products = Product.objects.annotate(
        avg_rating=Avg('reviews__rating'),
        review_count=Count('reviews')
    ).filter(review_count__gte=1).order_by('-avg_rating')[:5]
    
    return Response({
        'total_reviews': total_reviews,
        'average_rating': round(average_rating or 0, 1),
        'top_rated_products': [
            {
                'id': product.id,
                'name': product.name,
                'average_rating': round(product.avg_rating or 0, 1),
                'review_count': product.review_count
            }
            for product in top_products
        ]
    })