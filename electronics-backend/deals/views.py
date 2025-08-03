from rest_framework import viewsets
from .models import DailyDeal, Bundle, SmallItemPackage
from .serializers import DailyDealSerializer, BundleSerializer, SmallItemPackageSerializer

class DailyDealViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DailyDeal.objects.filter(active=True)
    serializer_class = DailyDealSerializer
    lookup_field = "slug"

class BundleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bundle.objects.filter(active=True)
    serializer_class = BundleSerializer
    lookup_field = 'slug'

class SmallItemPackageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SmallItemPackage.objects.filter(active=True)
    serializer_class = SmallItemPackageSerializer
    lookup_field = 'slug'
