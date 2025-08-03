from django.contrib import admin
from .models import SmallItemPackage, DailyDeal, Bundle

class DailyDealAdmin(admin.ModelAdmin):
    list_display = ('title', 'slug', 'price', 'discount', 'active')
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ('image_preview',)
    fields = ('title', 'slug', 'description', 'price', 'discount', 'active', 'image', 'image_preview')

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="200" style="object-fit: contain;" />'
        return "No image"
    image_preview.allow_tags = True
    image_preview.short_description = 'Image Preview'

class BundleAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ('image_preview',)
    fields = ('title', 'slug', 'description', 'price', 'discount', 'active', 'image', 'image_preview')

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="200" style="object-fit: contain;" />'
        return "No image"
    image_preview.allow_tags = True
    image_preview.short_description = 'Image Preview'

class SmallItemPackageAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ('image_preview',)
    fields = ('title', 'slug', 'description', 'price', 'discount', 'active', 'image', 'image_preview')

    def image_preview(self, obj):
        if obj.image:
            return f'<img src="{obj.image.url}" width="200" style="object-fit: contain;" />'
        return "No image"
    image_preview.allow_tags = True
    image_preview.short_description = 'Image Preview'

# Registering with custom admin
admin.site.register(DailyDeal, DailyDealAdmin)
admin.site.register(Bundle, BundleAdmin)
admin.site.register(SmallItemPackage, SmallItemPackageAdmin)
