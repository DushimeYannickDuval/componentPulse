from rest_framework import serializers
from .models import DailyDeal, Bundle, SmallItemPackage

class DailyDealSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyDeal
        fields = '__all__'

class BundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundle
        fields = '__all__'

class SmallItemPackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = SmallItemPackage
        fields = '__all__'
