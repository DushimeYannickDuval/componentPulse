from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from decimal import Decimal

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    # parent = models.ForeignKey('self', null=True, blank=True, related_name='children', on_delete=models.SET_NULL) # Uncomment if you need parent categories
    # created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True) # Uncomment if you need created_at

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
   
    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name='products')
    price = models.DecimalField(max_digits=10, decimal_places=2)
    compare_at_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    # cost_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) # Add if needed
    
    stock_quantity = models.PositiveIntegerField(default=0)
    low_stock_threshold = models.PositiveIntegerField(default=5, blank=True, null=True)
    
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True, blank=True)
    tags = models.ManyToManyField(Tag, through='ProductTag', blank=True, related_name='products') # Correct M2M definition
    
    image = models.ImageField(upload_to='products/main/', blank=True, null=True) # Main product image

    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    weight = models.DecimalField(max_digits=6, decimal_places=2, blank=True, null=True)
    dimensions = models.CharField(max_length=100, blank=True, null=True)
    warranty_period = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    @property
    def discount_percentage(self):
        active_deal = self.deals.filter(is_active=True, start_date__lte=timezone.now(), end_date__gte=timezone.now()).first()
        if active_deal and active_deal.discount_percentage:
            return active_deal.discount_percentage
        if self.compare_at_price and self.compare_at_price > self.price:
            return round(((self.compare_at_price - self.price) / self.compare_at_price) * 100)
        return Decimal('0')

    @property
    def is_on_sale(self):
        if self.compare_at_price and self.compare_at_price > self.price:
            return True
        return self.deals.filter(is_active=True, start_date__lte=timezone.now(), end_date__gte=timezone.now()).exists()

    @property
    def is_in_stock(self):
        return self.stock_quantity > 0

    @property
    def is_low_stock(self):
        if self.low_stock_threshold is not None:
            return 0 < self.stock_quantity <= self.low_stock_threshold
        return False

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ProductImage(models.Model):
    product = models.ForeignKey(Product, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='products/gallery/')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class ProductSpecification(models.Model):
    product = models.ForeignKey(Product, related_name='specifications', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    value = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class ProductFeature(models.Model):
    product = models.ForeignKey(Product, related_name='features', on_delete=models.CASCADE)
    feature = models.CharField(max_length=255)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

class ProductTag(models.Model): # This is the M2M through model
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE) # This creates 'tag_id' column

    class Meta:
        unique_together = ('product', 'tag')
        verbose_name = "Product Tag Assignment"
        verbose_name_plural = "Product Tag Assignments"

    def __str__(self):
        return f"{self.product.name} - {self.tag.name}"

class Deal(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    product = models.ForeignKey(Product, related_name='deals', on_delete=models.CASCADE)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2) # e.g., 10.50 for 10.50%
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def discounted_price(self):
        if self.discount_percentage and self.product:
            discount_amount = self.product.price * (self.discount_percentage / Decimal('100'))
            return (self.product.price - discount_amount).quantize(Decimal('0.01'))
        return self.product.price

    def __str__(self):
        return self.title