import { Link } from 'react-router-dom';
import type { Product } from '../api/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group block"
    >
      <div className="relative aspect-[3/4] bg-pitty-gray overflow-hidden mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
            Featured
          </span>
        )}
      </div>
      <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">
        {product.category_name}
      </p>
      <h3 className="text-sm font-medium group-hover:text-white/70 transition-colors">
        {product.name}
      </h3>
      <p className="text-sm font-semibold mt-1">${parseFloat(product.price).toFixed(2)}</p>
    </Link>
  );
}
