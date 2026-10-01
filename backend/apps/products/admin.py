from django.contrib import admin

from .models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price', 'stock', 'featured']
    list_filter = ['category', 'featured']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]
    fieldsets = (
        (None, {
            'fields': ('name', 'slug', 'category', 'description'),
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'stock', 'featured'),
        }),
        ('Media', {
            'fields': ('image_url',),
            'description': 'Use image_url for external images, or add images below.',
        }),
    )
