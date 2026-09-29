import { useEffect, useState } from 'react';
import { getCategories, getTestimonials } from '../api/endpoints';
import type { Category, Testimonial } from '../api/types';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import TestimonialCard from '../components/TestimonialCard';
import TrustBar from '../components/TrustBar';
import { HERO_IMAGE, SIGNATURE_BANNER } from '../constants/images';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
    getTestimonials().then(setTestimonials).catch(console.error);
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative h-[88vh] min-h-[560px] max-h-[900px] flex items-center">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Athlete training"
            className="w-full h-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-6 lg:px-16">
          <div className="max-w-xl animate-fade-in-up">
            <p className="text-[11px] tracking-[0.28em] uppercase text-white/65 mb-5">
              More than a brand
            </p>
            <h1 className="text-[2.75rem] sm:text-6xl lg:text-[4.5rem] font-black uppercase tracking-[0.02em] leading-[0.95] mb-5">
              It&apos;s a Mindset
            </h1>
            <p className="text-[11px] sm:text-xs tracking-[0.22em] uppercase text-white/75 mb-10">
              Discipline builds the strongest women
            </p>
            <Button to="/shop" variant="ghost">
              Shop Now →
            </Button>
          </div>
        </div>
      </section>

      <TrustBar />

      {/* Category Grid */}
      <section id="find-your-fit" className="bg-[#f2f2f2] text-black py-12 sm:py-14">
        <div className="text-center mb-8 sm:mb-10 px-4">
          <p className="text-[10px] tracking-[0.28em] uppercase text-black/40 mb-2">
            Shop by Category
          </p>
          <h2 className="text-2xl sm:text-[1.75rem] lg:text-[2rem] font-black uppercase tracking-[0.06em]">
            Find Your Fit
          </h2>
        </div>

        <div className="px-2 sm:px-3 lg:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[2px] sm:gap-[3px]">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Signature Collection */}
      <section className="relative bg-black">
        {/* Mobile: image then text */}
        <img
          src={SIGNATURE_BANNER}
          alt="Signature collection"
          className="lg:hidden w-full aspect-[5/2] object-cover object-center"
        />

        {/* Desktop: banner behind 3-column layout */}
        <div className="hidden lg:block absolute inset-0">
          <img
            src={SIGNATURE_BANNER}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-3 lg:min-h-[480px]">
          <div className="hidden lg:block" aria-hidden="true" />

          <div className="bg-[#111111] flex flex-col items-center justify-center text-center px-8 py-14 lg:py-16">
            <p className="text-[10px] tracking-[0.28em] uppercase text-white/45 mb-5">
              The Signature Collections.
            </p>
            <h2 className="text-xl sm:text-2xl lg:text-[1.65rem] font-black uppercase tracking-[0.04em] leading-tight mb-6">
              Performance Meets Style
            </h2>
            <p className="text-[13px] text-white/55 leading-[1.8] max-w-[280px] mb-9">
              High-quality, functional, and designed for women who never settle.
              The PITTY FIT collection is built to support your strength, inside and out.
            </p>
            <Button to="/shop" variant="solid">
              Shop the Collection →
            </Button>
          </div>

          <div className="hidden lg:block" aria-hidden="true" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-black py-16 sm:py-20">
        <h2 className="text-center text-[10px] tracking-[0.28em] uppercase text-white/45 mb-14 sm:mb-16">
          Real Women. Real Results.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 max-w-5xl mx-auto px-6">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </section>
    </>
  );
}
