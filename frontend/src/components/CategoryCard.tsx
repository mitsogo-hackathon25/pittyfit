import { Link } from 'react-router-dom';
import type { Category } from '../api/types';

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const image = `/images/categories/${category.slug}.jpg`;

  return (
    <Link
      to={`/shop?category=${category.slug}`}
      className="group relative block overflow-hidden bg-[#2b2b2b] aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]"
    >
      <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-4 lg:p-5">
        <img
          src={image}
          alt={category.name}
          className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 sm:px-5 sm:pb-5">
        <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.2em] uppercase text-white group-hover:text-white/80 transition-colors">
          {category.name} →
        </span>
      </div>
    </Link>
  );
}
