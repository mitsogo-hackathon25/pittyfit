import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../api/endpoints';
import type { Product } from '../api/types';
import Button from '../components/Button';
import ProductImageCarousel from '../components/ProductImageCarousel';
import { useCart } from '../context/CartContext';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    if (slug) {
      getProduct(slug).then(setProduct).catch(console.error);
    }
  }, [slug]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setMessage('Failed to add to cart.');
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="py-12 sm:py-16 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const images = [
    ...new Set(
      (product.images?.length
        ? product.images.map((img) => img.image)
        : [product.image]
      ).filter(Boolean),
    ),
  ];

  return (
    <div className="py-12 sm:py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageCarousel images={images} alt={product.name} />

          <div className="flex flex-col justify-center">
            <p className="text-xs tracking-[0.2em] uppercase text-white/50 mb-2">
              {product.category_name}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold mb-6">
              ${parseFloat(product.price).toFixed(2)}
            </p>
            <div className="mb-8">
              <p className="text-xs tracking-[0.15em] uppercase text-white/50 mb-3">
                Description
              </p>
              <p className="text-white/60 leading-relaxed">
                {product.description || 'No description available for this product yet.'}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-xs tracking-[0.15em] uppercase text-white/50 mb-3">Size</p>
              <div className="flex gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-sm font-medium border transition-colors ${
                      selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'border-white/30 text-white/70 hover:border-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs tracking-[0.15em] uppercase text-white/50 mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-white/30 hover:border-white transition-colors"
                >
                  −
                </button>
                <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-white/30 hover:border-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleAddToCart} variant="solid" disabled={adding}>
                {adding ? 'Adding...' : 'Add to Cart →'}
              </Button>
              <Button to="/cart" variant="ghost">
                View Cart
              </Button>
            </div>

            {message && (
              <p className="text-pitty-gold text-sm mt-4">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
