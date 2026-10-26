import json
import logging

from django.db import IntegrityError, OperationalError
from django.db.models import Q
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import Category, Product, ProductImage
from .serializers import (
    CategorySerializer,
    ProductDetailSerializer,
    ProductListSerializer,
    ProductWriteSerializer,
)
from .showcase_slots import SHOWCASE_SLOT_KEYS

logger = logging.getLogger(__name__)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'


class ProductViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('images')
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        return ProductListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        featured = self.request.query_params.get('featured')

        if category:
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        if featured:
            queryset = queryset.filter(featured=True)
        return queryset

    @action(detail=False, methods=['get'])
    def featured(self, request):
        products = self.get_queryset().filter(featured=True)[:6]
        serializer = ProductListSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)


class AdminProductPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 100


class AdminProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.select_related('category').prefetch_related('images')
    permission_classes = [IsAdminUser]
    pagination_class = AdminProductPagination
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action != 'list':
            return queryset

        search = self.request.query_params.get('search')
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')
        product_filter = self.request.query_params.get('filter')

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        if category:
            queryset = queryset.filter(category__slug=category)
        if product_filter == 'featured':
            queryset = queryset.filter(featured=True)
        elif product_filter == 'not_featured':
            queryset = queryset.filter(featured=False)
        elif product_filter == 'out_of_stock':
            queryset = queryset.filter(stock=0)
        elif product_filter == 'in_stock':
            queryset = queryset.filter(stock__gt=0)
        elif featured == 'true':
            queryset = queryset.filter(featured=True)
        elif featured == 'false':
            queryset = queryset.filter(featured=False)

        return queryset

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return ProductWriteSerializer
        return ProductDetailSerializer

    def _detail_response(self, product, status_code=status.HTTP_200_OK):
        serializer = ProductDetailSerializer(product, context={'request': self.request})
        return Response(serializer.data, status=status_code)

    def _parse_json_list(self, request, key):
        raw = request.data.get(key, '[]')
        if isinstance(raw, list):
            return raw
        try:
            return json.loads(raw)
        except (json.JSONDecodeError, TypeError):
            return []

    def _parse_deleted_image_ids(self, request):
        return [int(image_id) for image_id in self._parse_json_list(request, 'deleted_image_ids')]

    def _parse_cleared_showcase_slots(self, request):
        return [slot for slot in self._parse_json_list(request, 'cleared_showcase_slots') if slot in SHOWCASE_SLOT_KEYS]

    def _apply_product_images(self, product, request, require_images=False):
        deleted_ids = self._parse_deleted_image_ids(request)
        if deleted_ids:
            product.images.filter(id__in=deleted_ids).delete()

        cleared_slots = self._parse_cleared_showcase_slots(request)
        if cleared_slots:
            product.images.filter(showcase_slot__in=cleared_slots).delete()

        for slot in SHOWCASE_SLOT_KEYS:
            uploaded_file = request.FILES.get(f'showcase_{slot}')
            if not uploaded_file:
                continue
            product.images.filter(showcase_slot=slot).delete()
            ProductImage.objects.create(
                product=product,
                image=uploaded_file,
                showcase_slot=slot,
            )

        new_files = request.FILES.getlist('new_images')
        for uploaded_file in new_files:
            ProductImage.objects.create(product=product, image=uploaded_file)

        primary_image_id = request.data.get('primary_image_id')
        primary_slot = request.data.get('primary_showcase_slot')

        if primary_image_id:
            product.images.update(is_primary=False)
            product.images.filter(id=int(primary_image_id)).update(is_primary=True)
        elif primary_slot in SHOWCASE_SLOT_KEYS:
            product.images.update(is_primary=False)
            product.images.filter(showcase_slot=primary_slot).update(is_primary=True)
        elif product.images.filter(showcase_slot='model_0').exists():
            product.images.update(is_primary=False)
            product.images.filter(showcase_slot='model_0').update(is_primary=True)

        if product.images.exists() and not product.images.filter(is_primary=True).exists():
            first_image = product.images.first()
            first_image.is_primary = True
            first_image.save(update_fields=['is_primary'])

        if require_images and not product.images.exists():
            raise serializers.ValidationError(
                {'images': 'Upload at least one product image (catalog or showcase section).'}
            )

    def _has_any_image_upload(self, request):
        if request.FILES.getlist('new_images'):
            return True
        return any(request.FILES.get(f'showcase_{slot}') for slot in SHOWCASE_SLOT_KEYS)

    def create(self, request, *args, **kwargs):
        if not self._has_any_image_upload(request):
            return Response(
                {'images': ['Upload at least one image in any showcase section or catalog image.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        write_serializer = self.get_serializer(data=request.data)
        write_serializer.is_valid(raise_exception=True)
        try:
            product = write_serializer.save()
        except IntegrityError:
            return Response(
                {'slug': ['A product with this slug already exists. Choose a unique slug.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            self._apply_product_images(product, request, require_images=True)
        except serializers.ValidationError as exc:
            product.delete()
            return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)
        except (OperationalError, OSError, PermissionError) as exc:
            logger.exception('Product image save failed on create')
            product.delete()
            return Response(
                {
                    'images': [
                        'Could not save images on the server. Run database migrations, '
                        'ensure the media/ folder is writable, and check upload size limits. '
                        f'({exc})'
                    ]
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return self._detail_response(product, status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        product = self.get_object()
        write_serializer = self.get_serializer(product, data=request.data, partial=partial)
        write_serializer.is_valid(raise_exception=True)
        try:
            product = write_serializer.save()
        except IntegrityError:
            return Response(
                {'slug': ['A product with this slug already exists. Choose a unique slug.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            self._apply_product_images(product, request, require_images=True)
        except serializers.ValidationError as exc:
            return Response(exc.detail, status=status.HTTP_400_BAD_REQUEST)
        except (OperationalError, OSError, PermissionError) as exc:
            logger.exception('Product image save failed on update')
            return Response(
                {
                    'images': [
                        'Could not save images on the server. Run database migrations, '
                        'ensure the media/ folder is writable, and check upload size limits. '
                        f'({exc})'
                    ]
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        return self._detail_response(product)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
