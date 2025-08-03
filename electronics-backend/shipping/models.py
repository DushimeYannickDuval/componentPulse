from django.db import models
from django.core.validators import MinValueValidator

class ShippingZone(models.Model):
    name = models.CharField(max_length=100)
    cities = models.TextField(help_text="Comma-separated list of cities")
    min_delivery_days = models.PositiveIntegerField(default=1)
    max_delivery_days = models.PositiveIntegerField(default=3)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class ShippingRate(models.Model):
    zone = models.ForeignKey(ShippingZone, on_delete=models.CASCADE, related_name='rates')
    name = models.CharField(max_length=100)
    min_weight = models.DecimalField(max_digits=8, decimal_places=2, default=0, help_text="Minimum weight in kg")
    max_weight = models.DecimalField(max_digits=8, decimal_places=2, help_text="Maximum weight in kg")
    base_cost = models.DecimalField(max_digits=10, decimal_places=2, help_text="Base shipping cost in UGX")
    per_kg_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Additional cost per kg in UGX")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['min_weight']
    
    def __str__(self):
        return f"{self.zone.name} - {self.name}"

class ShippingMethod(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    base_cost = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_days = models.CharField(max_length=20, help_text="e.g., 1-3 days")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name