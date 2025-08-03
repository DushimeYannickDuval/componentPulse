from rest_framework import generics, filters, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Avg
from .models import Category, Product, Deal
from .serializers import CategorySerializer, ProductListSerializer, ProductDetailSerializer, DealSerializer

class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer

class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'tags__tag', 'specifications__value', 'features__feature']
    ordering_fields = ['price', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category').prefetch_related('images')
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__slug=category)
        
        featured = self.request.query_params.get('featured')
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)
        
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        in_stock = self.request.query_params.get('in_stock')
        if in_stock == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)
        
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request  # ✅ Fixes image URL issues
        return context


class ProductDetailAPIView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductDetailSerializer
    lookup_field = 'slug'

@api_view(['GET'])
def featured_products(request):
    products = Product.objects.filter(is_active=True, is_featured=True)[:8]
    serializer = ProductListSerializer(products, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['GET'])
def search_products(request):
    query = request.GET.get('q', '')
    if not query:
        return Response({'results': []})
    
    products = Product.objects.filter(
        Q(name__icontains=query) |
        Q(description__icontains=query) |
        Q(tags__tag__icontains=query) |
        Q(category__name__icontains=query)
    ).filter(is_active=True).distinct()[:20]
    
    serializer = ProductListSerializer(products, many=True, context={'request': request})
    return Response({'results': serializer.data})

@api_view(['GET'])
def product_recommendations(request, product_id):
    try:
        product = Product.objects.get(id=product_id, is_active=True)
        # Get products from same category, excluding current product
        recommendations = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product_id)[:4]
        
        serializer = ProductListSerializer(recommendations, many=True, context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

class DealListView(generics.ListAPIView):
    serializer_class = DealSerializer
    
    def get_queryset(self):
        from django.utils import timezone
        return Deal.objects.filter(
            is_active=True,
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        ).select_related('product')

@api_view(['GET'])
def product_stats(request):
    total_products = Product.objects.filter(is_active=True).count()
    categories_count = Category.objects.filter(is_active=True).count()
    featured_count = Product.objects.filter(is_active=True, is_featured=True).count()
    
    return Response({
        'total_products': total_products,
        'categories_count': categories_count,
        'featured_count': featured_count
    })