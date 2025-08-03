from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductSpecification, ProductFeature, Tag, Deal # ProductTag is not directly serialized here usually

class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image_url', 'is_active']
        # Add 'parent', 'created_at' if in model and needed
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary', 'order']
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            return request.build_absolute_uri(obj.image.url) if request else obj.image.url
        return None

class ProductSpecificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSpecification
        fields = ['id', 'name', 'value', 'order']

class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ['id', 'feature', 'order']

class TagSerializer(serializers.ModelSerializer): # Serializer for the Tag model itself
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']

class ProductListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    main_image_url = serializers.SerializerMethodField()
    discount_percentage = serializers.ReadOnlyField() # Uses @property on Product model
    is_on_sale = serializers.ReadOnlyField()         # Uses @property on Product model
    is_in_stock = serializers.ReadOnlyField()       # Uses @property on Product model
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'sku', 'price', 'compare_at_price', 
            'discount_percentage', 'is_on_sale', 'is_featured', 'is_in_stock', 
            'stock_quantity', 'category', 'main_image_url', 'created_at'
        ]
    
    def get_main_image_url(self, obj):
        request = self.context.get('request')
        main_image_instance = None
        if obj.image and hasattr(obj.image, 'url'): # Main product image
            main_image_instance = obj.image
        else:
            primary_gallery_image = obj.images.filter(is_primary=True).first()
            if primary_gallery_image and hasattr(primary_gallery_image.image, 'url'):
                main_image_instance = primary_gallery_image.image
            else:
                first_gallery_image = obj.images.first()
                if first_gallery_image and hasattr(first_gallery_image.image, 'url'):
                    main_image_instance = first_gallery_image.image
        
        if main_image_instance:
            return request.build_absolute_uri(main_image_instance.url) if request else main_image_instance.url
        return None

class ProductDetailSerializer(ProductListSerializer): # Inherits from ListSerializer
    images = ProductImageSerializer(many=True, read_only=True)
    specifications = ProductSpecificationSerializer(many=True, read_only=True)
    features = ProductFeatureSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True) # Serializes related Tag objects directly
    is_low_stock = serializers.ReadOnlyField()      # Uses @property on Product model
    
    class Meta(ProductListSerializer.Meta): # Inherit Meta from parent
        fields = ProductListSerializer.Meta.fields + [ # Add new fields
            'description', 'low_stock_threshold', 'weight', 'dimensions', 
            'warranty_period', 'is_low_stock', 'images', 'specifications', 
            'features', 'tags', 'updated_at'
        ]

class DealSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True) # Use ProductListSerializer for nested product
    discounted_price = serializers.ReadOnlyField() # Uses @property on Deal model
    
    class Meta:
        model = Deal
        fields = [
            'id', 'title', 'description', 'product', 'discount_percentage',
            'discounted_price', 'start_date', 'end_date', 'is_active', 'created_at'
        ]
