from django.contrib import admin
from .models import (
    Category, Product, ProductImage, ProductSpecification, 
    ProductFeature, Tag, ProductTag, Deal
)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'is_active') # Add 'parent', 'created_at' if you uncomment them in model
    list_filter = ('is_active',) # Add 'parent', 'created_at' if you uncomment them in model
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    # autocomplete_fields = ['parent'] # If parent is enabled

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
    ordering = ['order']

class ProductSpecificationInline(admin.TabularInline):
    model = ProductSpecification
    extra = 1
    ordering = ['order']

class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1
    ordering = ['order']

class ProductTagInline(admin.TabularInline):
    model = ProductTag # This is the through model
    extra = 1
    autocomplete_fields = ['tag'] # Refers to the 'tag' field in ProductTag model

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'sku', 'category', 'price', 'stock_quantity', 'is_active', 'is_featured', 'created_at')
    list_filter = ('is_active', 'is_featured', 'category', 'created_at')
    search_fields = ('name', 'sku', 'description')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline, ProductSpecificationInline, ProductFeatureInline, ProductTagInline]
    autocomplete_fields = ['category'] # Refers to 'category' field in Product model
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'sku', 'category', 'description', 'image')
        }),
        ('Pricing & Stock', {
            'fields': ('price', 'compare_at_price', 'stock_quantity', 'low_stock_threshold') # Add 'cost_price' if in model
        }),
        ('Product Details', {
            'fields': ('weight', 'dimensions', 'warranty_period')
        }),
        ('Status & Timestamps', {
            'fields': ('is_active', 'is_featured', ('created_at', 'updated_at'))
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Deal)
class DealAdmin(admin.ModelAdmin):
    list_display = ('title', 'product', 'discount_percentage', 'start_date', 'end_date', 'is_active', 'created_at')
    list_filter = ('is_active', 'start_date', 'end_date')
    search_fields = ('title', 'product__name')
    autocomplete_fields = ['product'] # Refers to 'product' field in Deal model
    date_hierarchy = 'created_at'

# admin.site.register(ProductTag) # Usually not needed if managed via inline
