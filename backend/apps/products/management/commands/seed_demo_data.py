from decimal import Decimal

from django.core.management.base import BaseCommand

from apps.products.models import Category, Product, ProductImage
CATEGORIES = [
    {
        'name': 'Women',
        'slug': 'women',
        'order': 1,
        'image_url': '',
    },
    {
        'name': 'Men',
        'slug': 'men',
        'order': 2,
        'image_url': '',
    },
    {
        'name': 'Accessories',
        'slug': 'accessories',
        'order': 3,
        'image_url': '',
    },
    {
        'name': 'Supplements',
        'slug': 'supplements',
        'order': 4,
        'image_url': '',
    },
]

PRODUCT_DESCRIPTIONS = {
    'Sculpt High-Rise Leggings': (
        'High-rise sculpting leggings with a wide waistband that stays put through squats, '
        'lunges, and sprints. Sweat-wicking four-way stretch fabric with a smooth, compressive fit.'
    ),
    'Power Flex Leggings': (
        'Built for heavy training days. Power Flex leggings deliver medium compression, '
        'quick-dry performance, and a second-skin feel that moves with every rep.'
    ),
    'Seamless Core Leggings': (
        'Minimal seams, maximum comfort. The Seamless Core legging reduces chafing during '
        'long sessions while keeping you supported from warm-up to cool-down.'
    ),
    'Impact Support Bra': (
        'High-impact support for HIIT, running, and plyometrics. Molded cups, adjustable straps, '
        'and a secure underband keep you locked in without sacrificing breathability.'
    ),
    'Strappy Back Sports Bra': (
        'A statement strappy back meets medium support. Lightweight, breathable, and designed '
        'to layer under tanks or wear solo for studio and strength workouts.'
    ),
    'Light Support Bralette': (
        'Soft, low-impact support for yoga, walking, and recovery days. Wire-free comfort '
        'with a sleek silhouette that pairs with any Pitty Fit bottom.'
    ),
    'Muscle Tank': (
        'Relaxed muscle tank with dropped armholes for airflow. Soft cotton-blend fabric '
        'that layers easily over sports bras or wears on its own.'
    ),
    'Cropped Performance Tank': (
        'Cropped length with a fitted performance cut. Moisture-wicking and quick-drying '
        'for treadmill intervals, lifting, and everything in between.'
    ),
    'Racerback Tank': (
        'Classic racerback design with a flattering fit. Lightweight fabric and a curved hem '
        'make this an everyday training essential.'
    ),
    'Training Shorts': (
        'Mid-rise training shorts with a lined inner brief and side pockets. Four-way stretch '
        'fabric built for box jumps, sprints, and leg day.'
    ),
    'Biker Shorts': (
        '7-inch inseam biker shorts with a high waist and squat-proof coverage. Smooth, '
        'compressive fabric that stays in place through every set.'
    ),
    'Running Shorts': (
        'Lightweight running shorts with a brief liner and reflective details. Quick-dry '
        'material and an elastic waistband for miles of comfortable movement.'
    ),
    'Oversized Hoodie': (
        'Oversized fit with a brushed fleece interior. Perfect for warm-ups, rest days, and '
        'post-workout layers. Ribbed cuffs and a kangaroo pocket complete the look.'
    ),
    'Zip-Up Hoodie': (
        'Full-zip hoodie with thumb holes and a fitted athletic cut. Breathable fleece '
        'keeps you warm without overheating during outdoor training.'
    ),
    'Cropped Hoodie': (
        'Cropped silhouette with a raw hem edge. Soft, heavyweight fabric for studio-to-street '
        'style over high-rise leggings or biker shorts.'
    ),
    'Gym Bag': (
        'Spacious gym bag with a shoe compartment and water-resistant base. Padded straps, '
        'interior pockets, and room for all your training essentials.'
    ),
    'Resistance Bands Set': (
        'Three-band set with light, medium, and heavy resistance levels. Ideal for glute '
        'activation, mobility work, and adding tension to any strength routine.'
    ),
    'Water Bottle': (
        '32oz stainless steel water bottle with a leak-proof lid. Double-wall insulation '
        'keeps drinks cold through the longest sessions.'
    ),
}

PRODUCTS = {
    'women': [
        ('Sculpt High-Rise Leggings', 68.00, True),
        ('Impact Support Bra', 48.00, True),
        ('Seamless Core Leggings', 65.00, True),
    ],
    'men': [
        ('Performance Tee', 42.00, True),
        ('Training Shorts', 55.00, False),
        ('Oversized Hoodie', 78.00, True),
    ],
    'accessories': [
        ('Gym Bag', 45.00, False),
        ('Resistance Bands Set', 28.00, True),
        ('Water Bottle', 22.00, False),
    ],
    'supplements': [
        ('Whey Protein', 54.00, True),
        ('Pre-Workout', 39.00, True),
        ('Creatine Monohydrate', 29.00, False),
    ],
}

IMAGE_URLS = [
    'https://images.unsplash.com/photo-1518310383802-640c2b311c37?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594381898411-8465977be4e7?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=800&fit=crop',
]


class Command(BaseCommand):
    help = 'Seed demo categories and products'

    def handle(self, *args, **options):
        self.stdout.write('Seeding demo data...')

        keep_slugs = {cat['slug'] for cat in CATEGORIES}
        removed, _ = Category.objects.exclude(slug__in=keep_slugs).delete()
        if removed:
            self.stdout.write(f'  Removed {removed} stale category-related row(s)')

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
                        'description': PRODUCT_DESCRIPTIONS.get(
                            name,
                            (
                                f'{name} — engineered for performance. Premium fabric, '
                                'four-way stretch, and a fit that moves with you through '
                                'every rep. Built for women who demand more.'
                            ),
                        ),
                        'image_url': IMAGE_URLS[img_idx % len(IMAGE_URLS)],
                        'stock': 100,
                    },
                )
                product.images.all().delete()
                for offset in range(4):
                    ProductImage.objects.create(
                        product=product,
                        image_url=IMAGE_URLS[(img_idx + offset) % len(IMAGE_URLS)],
                        is_primary=(offset == 0),
                    )
                img_idx += 1
                status = 'Created' if created else 'Updated'
                self.stdout.write(f'  {status} product: {product.name}')

        self.stdout.write(self.style.SUCCESS('Demo data seeded successfully!'))
