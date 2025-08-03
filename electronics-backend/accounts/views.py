from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from google.auth.transport import requests
from google.oauth2 import id_token
import uuid

from .models import User, UserProfile
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, GoogleAuthSerializer,
    UserProfileSerializer, PasswordChangeSerializer
)


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        tokens = get_tokens_for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': tokens,
            'message': 'Registration successful'
        }, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        tokens = get_tokens_for_user(user)
        
        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': tokens,
            'message': 'Login successful'
        })


class GoogleAuthView(generics.GenericAPIView):
    serializer_class = GoogleAuthSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        google_token = serializer.validated_data['google_token']
        
        try:
            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                google_token, requests.Request(), 
                "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
            )
            
            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')
            
            google_id = idinfo['sub']
            email = idinfo['email']
            first_name = idinfo.get('given_name', '')
            last_name = idinfo.get('family_name', '')
            picture = idinfo.get('picture', '')
            
            # Check if user exists
            try:
                user = User.objects.get(email=email)
                if not user.is_google_user:
                    user.google_id = google_id
                    user.is_google_user = True
                    user.save()
            except User.DoesNotExist:
                # Create new user
                username = email.split('@')[0] + str(uuid.uuid4())[:8]
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    first_name=first_name,
                    last_name=last_name,
                    google_id=google_id,
                    is_google_user=True,
                    is_email_verified=True
                )
                UserProfile.objects.create(user=user)
            
            tokens = get_tokens_for_user(user)
            
            return Response({
                'user': UserProfileSerializer(user).data,
                'tokens': tokens,
                'message': 'Google authentication successful'
            })
            
        except ValueError as e:
            return Response({
                'error': 'Invalid Google token'
            }, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = PasswordChangeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            'message': 'Password changed successfully'
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout successful'})
    except Exception as e:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)
