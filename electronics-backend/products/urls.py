from django.urls import path
from . import views
from .views import ProductDetailAPIView

urlpatterns = [
    # Fix: removed 'products/' prefix — it's already handled in main urls.py
    path('categories/', views.CategoryListView.as_view(), name='category_list'),
    path('featured/', views.featured_products, name='featured_products'),
    path('', views.ProductListView.as_view(), name='product_list'),
    path('search/', views.search_products, name='search_products'),
    path('stats/', views.product_stats, name='product_stats'),
    path('deals/', views.DealListView.as_view(), name='deal_list'),
    path('slug/<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail-by-slug'),
    path('<slug:slug>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path('id/<int:pk>/', ProductDetailAPIView.as_view(), name='product-detail-by-id'),
    path('<int:product_id>/recommendations/', views.product_recommendations, name='product_recommendations'),
]
