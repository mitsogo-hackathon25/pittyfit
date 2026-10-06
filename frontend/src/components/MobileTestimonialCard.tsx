import { Star } from 'lucide-react';
import type { Testimonial } from '../api/types';

interface MobileTestimonialCardProps {
  testimonial: Testimonial;
}

export default function MobileTestimonialCard({ testimonial }: MobileTestimonialCardProps) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8 border border-white/10 bg-[#0d0d0d]">
      <img
        src={testimonial.avatar_url}
        alt={testimonial.name}
        className="w-11 h-11 rounded-full object-cover mb-5"
      />
      <blockquote className="font-serif italic text-white/75 text-[13px] leading-[1.7] mb-5">
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
