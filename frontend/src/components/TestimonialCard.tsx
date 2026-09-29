import { Star } from 'lucide-react';
import type { Testimonial } from '../api/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 lg:px-8">
      <img
        src={testimonial.avatar_url}
        alt={testimonial.name}
        className="w-12 h-12 rounded-full object-cover mb-5"
      />
      <blockquote className="font-serif italic text-white/75 text-[13px] sm:text-sm leading-[1.7] mb-5 max-w-xs">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <p className="text-[11px] tracking-[0.15em] text-white/50 mb-2">
        — {testimonial.name}
      </p>
      <div className="flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={12} className="fill-pitty-gold text-pitty-gold" />
        ))}
      </div>
    </div>
  );
}
