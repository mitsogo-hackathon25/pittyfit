import { Heart, Plus, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Product } from '../api/types';
import { useCart } from '../context/CartContext';

const COLOR_SWATCHES = ['#1a1a1a', '#6b7280', '#9ca3af', '#d1d5db'];

interface FeaturedProductCardProps {
  product: Product;
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const { addToCart } = useCart();

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id);
  };

  return (
    <Link to={`/shop/${product.slug}`} className="group block flex-shrink-0 w-[148px] sm:w-[180px]">
      <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          type="button"
          className="absolute top-2.5 right-2.5 text-white/70 hover:text-white transition-colors"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={16} strokeWidth={1.5} />
        </button>
      </div>

      <h3 className="text-[11px] sm:text-xs font-medium leading-snug mb-1.5 line-clamp-2">
        {product.name}
      </h3>

      <div className="flex items-center gap-0.5 mb-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={10} className="fill-pitty-gold text-pitty-gold" />
        ))}
      </div>

      <p className="text-xs sm:text-sm font-semibold mb-3">
        ${parseFloat(product.price).toFixed(2)}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {COLOR_SWATCHES.map((color) => (
            <span
              key={color}
              className="w-3.5 h-3.5 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-white/80 hover:bg-white hover:text-black transition-colors"
          aria-label="Add to cart"
        >
          <Plus size={14} strokeWidth={2} />
        </button>
      </div>
    </Link>
  );
}
