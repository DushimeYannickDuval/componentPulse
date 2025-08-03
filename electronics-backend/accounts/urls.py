from django.urls import path
from .views import (
    RegisterView, LoginView, GoogleAuthView, UserProfileView,
    ChangePasswordView, logout_view, user_profile
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google-auth/', GoogleAuthView.as_view(), name='google_auth'),
    path('profile/', UserProfileView.as_view(), name='user_profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('logout/', logout_view, name='logout'),
    path('me/', user_profile, name='user_profile_detail'),
]
