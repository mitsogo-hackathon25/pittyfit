import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api/endpoints';
import type { Product } from '../api/types';
import Button from '../components/Button';
import ProductShowcaseGallery from '../components/ProductShowcaseGallery';

export default function ProductShowcase() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (slug) {
      getProduct(slug).then(setProduct).catch(console.error);
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="py-12 sm:py-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const showcaseImages =
    product.images?.length
      ? product.images
      : product.image
        ? [{ id: 0, image: product.image, is_primary: true }]
        : [];

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/45 mb-1">
              Product showcase
            </p>
            <h1 className="text-sm sm:text-base font-semibold uppercase tracking-[0.12em]">
              {product.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to={`/shop/${product.slug}`} variant="ghost" className="px-6 py-2.5 text-[10px]">
              ← Back to Shop Item
            </Button>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors"
            >
              All Products
            </Link>
          </div>
        </div>
      </div>

      <div className="w-full lg:max-w-none">
        <ProductShowcaseGallery productName={product.name} images={showcaseImages} />
      </div>
    </div>
  );
}
