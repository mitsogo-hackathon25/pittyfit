from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AdminProductViewSet, CategoryViewSet, ProductViewSet

router = DefaultRouter()
router.register('categories', CategoryViewSet, basename='category')
router.register('products', ProductViewSet, basename='product')
router.register('admin/products', AdminProductViewSet, basename='admin-product')

urlpatterns = [
    path('', include(router.urls)),
]
