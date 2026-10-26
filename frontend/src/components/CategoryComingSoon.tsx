import { Link } from 'react-router-dom';
import Button from './Button';
import { CATEGORY_IMAGES } from '../constants/images';

interface CategoryComingSoonProps {
  categoryName: string;
  categorySlug?: string;
  compact?: boolean;
}

export default function CategoryComingSoon({
  categoryName,
  categorySlug,
  compact = false,
}: CategoryComingSoonProps) {
  const image =
    (categorySlug && CATEGORY_IMAGES[categorySlug as keyof typeof CATEGORY_IMAGES]) ||
    '/images/categories/women.jpg';

  if (compact) {
    return (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px] px-3 text-center">
        <span className="mb-2 inline-block border border-[var(--color-pitty-gold)]/60 px-2.5 py-0.5 text-[8px] sm:text-[9px] font-semibold uppercase tracking-[0.22em] text-[var(--color-pitty-gold)]">
          Coming Soon
        </span>
        <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-white/90">
          {categoryName}
        </p>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden rounded-sm border border-white/10 bg-[#111111] animate-fade-in-up"
      role="status"
      aria-live="polite"
    >
      <div className="absolute inset-0 opacity-25">
        <img src={image} alt="" className="h-full w-full object-cover" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
      </div>

      <div className="relative flex flex-col items-center justify-center px-6 py-16 sm:py-24 md:py-28 text-center">
        <p className="mb-3 text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/45">
          {categoryName}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[0.06em] text-white mb-4">
          Coming Soon
        </h2>
        <p className="max-w-md text-sm sm:text-base text-white/55 leading-relaxed mb-8 sm:mb-10 px-2">
          We&apos;re curating something special for this collection. Check back soon or explore
          what&apos;s live in the shop.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-xs sm:max-w-none sm:w-auto">
          <Button to="/shop" variant="solid" className="w-full sm:w-auto px-8 py-3 text-[10px]">
            Browse All Products
          </Button>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-3 text-[10px] font-semibold uppercase tracking-[0.2em] border border-white/30 text-white/80 hover:border-white hover:text-white transition-colors"
          >
            Back Home
          </Link>
        </div>
        <div
          className="mt-10 h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-[var(--color-pitty-gold)] to-transparent"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
