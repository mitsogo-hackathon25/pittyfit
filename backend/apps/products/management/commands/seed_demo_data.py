from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.products.models import Category, Product, ProductImage
from apps.reviews.models import Testimonial

CATEGORIES = [
    {
        'name': 'Leggings',
        'slug': 'leggings',
        'order': 1,
        'image_url': 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=700&fit=crop&q=80',
    },
    {
        'name': 'Sports Bras',
        'slug': 'sports-bras',
        'order': 2,
        'image_url': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&h=700&fit=crop&q=80',
    },
    {
        'name': 'Tank Tops',
        'slug': 'tank-tops',
        'order': 3,
        'image_url': 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&h=700&fit=crop&q=80',
    },
    {
        'name': 'Shorts',
        'slug': 'shorts',
        'order': 4,
        'image_url': 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=700&fit=crop&q=80',
    },
    {
        'name': 'Hoodies',
        'slug': 'hoodies',
        'order': 5,
        'image_url': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=700&fit=crop&q=80',
    },
    {
        'name': 'Accessories',
        'slug': 'accessories',
        'order': 6,
        'image_url': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&h=700&fit=crop&q=80',
    },
]

PRODUCTS = {
    'leggings': [
        ('Sculpt High-Rise Leggings', 68.00, True),
        ('Power Flex Leggings', 72.00, False),
        ('Seamless Core Leggings', 65.00, True),
    ],
    'sports-bras': [
        ('Impact Support Bra', 48.00, True),
        ('Strappy Back Sports Bra', 52.00, False),
        ('Light Support Bralette', 42.00, False),
    ],
    'tank-tops': [
        ('Muscle Tank', 38.00, False),
        ('Cropped Performance Tank', 45.00, True),
        ('Racerback Tank', 40.00, False),
    ],
    'shorts': [
        ('Training Shorts', 55.00, True),
        ('Biker Shorts', 58.00, False),
        ('Running Shorts', 50.00, False),
    ],
    'hoodies': [
        ('Oversized Hoodie', 78.00, True),
        ('Zip-Up Hoodie', 85.00, False),
        ('Cropped Hoodie', 72.00, False),
    ],
    'accessories': [
        ('Gym Bag', 45.00, False),
        ('Resistance Bands Set', 28.00, True),
        ('Water Bottle', 22.00, False),
    ],
}

TESTIMONIALS = [
    {
        'name': 'Sarah L.',
        'quote': 'The quality is unmatched. These leggings stay in place through every squat and sprint. I finally found gear that matches my intensity.',
        'rating': 5,
        'avatar_url': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        'order': 1,
    },
    {
        'name': 'Maya R.',
        'quote': 'Pitty Fit changed how I show up to the gym. The fit is incredible and the brand message keeps me motivated every single day.',
        'rating': 5,
        'avatar_url': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        'order': 2,
    },
    {
        'name': 'Jessica K.',
        'quote': 'Finally, activewear designed for women who train hard. Premium feel, bold style, and built to last. Obsessed with my entire order.',
        'rating': 5,
        'avatar_url': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
        'order': 3,
    },
]

IMAGE_URLS = [
    'https://images.unsplash.com/photo-1518310383802-640c2b311c37?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594381898411-8465977be4e7?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop',
]


class Command(BaseCommand):
    help = 'Seed demo categories, products, and testimonials'

    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data...')

        categories = {}
        for cat_data in CATEGORIES:
            cat, created = Category.objects.update_or_create(
                slug=cat_data['slug'],
                defaults=cat_data,
            )
            categories[cat_data['slug']] = cat
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status} category: {cat.name}')

        img_idx = 0
        for slug, products in PRODUCTS.items():
            category = categories[slug]
            for name, price, featured in products:
                product, created = Product.objects.update_or_create(
                    name=name,
                    defaults={
                        'category': category,
                        'price': Decimal(str(price)),
                        'featured': featured,
                        'description': (
                            f'{name} — engineered for performance. Premium fabric, '
                            'four-way stretch, and a fit that moves with you through '
                            'every rep. Built for women who demand more.'
                        ),
                        'image_url': IMAGE_URLS[img_idx % len(IMAGE_URLS)],
                        'stock': 100,
                    },
                )
                ProductImage.objects.update_or_create(
                    product=product,
                    is_primary=True,
                    defaults={'image_url': IMAGE_URLS[img_idx % len(IMAGE_URLS)]},
                )
                img_idx += 1
                status = 'Created' if created else 'Updated'
                self.stdout.write(f'  {status} product: {product.name}')

        for t_data in TESTIMONIALS:
            testimonial, created = Testimonial.objects.update_or_create(
                name=t_data['name'],
                defaults={**t_data, 'is_featured': True},
            )
            status = 'Created' if created else 'Updated'
            self.stdout.write(f'  {status} testimonial: {testimonial.name}')

        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully!'))
