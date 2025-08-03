from django.urls import path
from . import views

urlpatterns = [
    path('product/<int:product_id>/', views.get_product_reviews, name='get_product_reviews'),
    path('user/', views.get_user_reviews, name='get_user_reviews'),
    path('create/', views.create_review, name='create_review'),
    path('<int:review_id>/', views.review_detail, name='review_detail'),
    path('summary/', views.review_summary, name='review_summary'),
]