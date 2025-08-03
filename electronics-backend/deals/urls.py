from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DailyDealViewSet, BundleViewSet, SmallItemPackageViewSet

router = DefaultRouter()
router.register(r'daily-deals', DailyDealViewSet, basename='dailydeal')
router.register(r'bundles', BundleViewSet, basename='bundle')
router.register(r'packages', SmallItemPackageViewSet, basename='package')

urlpatterns = [
    path('', include(router.urls)),
]
