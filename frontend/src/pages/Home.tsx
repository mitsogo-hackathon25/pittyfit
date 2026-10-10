import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/endpoints';
import type { Category } from '../api/types';
import BrandValues from '../components/BrandValues';
import Button from '../components/Button';
import CategoryCard from '../components/CategoryCard';
import InstagramFeed from '../components/InstagramFeed';
import NewsletterSection from '../components/NewsletterSection';
import TrustBar from '../components/TrustBar';
import {
  HERO_IMAGE_2X,
  HERO_IMAGE_DESKTOP,
  HERO_IMAGE_MOBILE,
  SIGNATURE_BANNER,
  SIGNATURE_MOBILE_LEFT,
} from '../constants/images';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <>
      {/* ─── Mobile homepage (< lg) ─── */}
      <div className="lg:hidden overflow-x-hidden">
        <section className="relative w-full overflow-hidden h-[72vh] min-h-[420px] max-h-[580px] flex items-center">
          <div className="absolute inset-0 overflow-hidden bg-black">
            <img
              src={HERO_IMAGE_MOBILE}
              srcSet={`${HERO_IMAGE_MOBILE} 1476w, ${HERO_IMAGE_2X} 2170w`}
              sizes="100vw"
              alt="PITTY FIT athlete in gym"
              width={1476}
              height={725}
              className="absolute inset-0 h-full w-full object-cover object-[56%_36%]"
              fetchPriority="high"
            />
            <div className="absolute inset-y-0 left-0 z-[1] w-[68%] bg-gradient-to-r from-black/90 via-black/55 to-transparent pointer-events-none" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>
          <div className="relative z-10 w-full px-5 py-6">
            <div className="max-w-[260px] animate-fade-in-up [text-shadow:0_2px_12px_rgba(0,0,0,0.85)]">
              <p className="text-[9px] tracking-[0.26em] uppercase text-white mb-3">
                More than a brand
              </p>
              <h1 className="text-[1.75rem] font-black uppercase tracking-[0.01em] leading-[1.08] mb-6 text-white">
                It&apos;s a Mindset
              </h1>
              <Button to="/shop" variant="solid" className="px-7 py-3 text-[10px]">
                Shop Now →
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] border-t border-white/10">
          <div className="grid grid-cols-4">
            {[
              { title: 'FREE SHIPPING', sub: 'ON ORDERS OVER $75' },
              { title: 'SECURE CHECKOUT', sub: 'SHOP WITH CONFIDENCE' },
              { title: 'PREMIUM QUALITY', sub: 'BUILT FOR PERFORMANCE' },
              { title: 'SUSTAINABLE PACKAGING', sub: 'A CLEANER TOMORROW' },
            ].map((item, index) => (
              <div
                key={item.title}
                className={`flex flex-col items-center justify-center text-center px-2 py-5 gap-2 ${
                  index < 3 ? 'border-r border-white/10' : ''
                }`}
              >
                <p className="text-[7px] font-semibold tracking-[0.08em] uppercase leading-tight">
                  {item.title}
                </p>
                <p className="text-[6px] text-white/45 tracking-[0.06em] uppercase mt-0.5 leading-tight">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="find-your-fit" className="bg-[#f2f2f2] text-black py-10">
          <div className="text-center mb-7 px-4">
            <p className="text-[9px] tracking-[0.28em] uppercase text-black/40 mb-2">
              Shop by Category
            </p>
            <h2 className="font-serif text-[1.65rem] font-bold uppercase tracking-[0.04em]">
              Find Your Fit
            </h2>
          </div>
          <div className="px-2">
            <div className="grid grid-cols-2 gap-[2px]">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} mobile />
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-black grid grid-cols-2 min-h-[300px]">
          <img
            src={SIGNATURE_MOBILE_LEFT}
            alt="Signature collection"
            className="block w-full h-full min-h-[300px] object-cover object-[40%_center]"
          />
          <div className="bg-[#111111] flex flex-col justify-center px-4 py-6">
            <h2 className="font-serif text-[13px] font-bold uppercase tracking-[0.03em] leading-tight mb-3">
              Performance Meets Style
            </h2>
            <p className="text-[9px] text-white/55 leading-[1.7] mb-5">
              High-quality, functional, and designed for women who never settle.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.16em] border border-white text-white hover:bg-white hover:text-black transition-colors w-fit"
            >
              Shop the Collection →
            </Link>
          </div>
        </section>

        <BrandValues />

        <InstagramFeed />
        <NewsletterSection />
      </div>

      {/* ─── Desktop homepage (≥ lg) — exact original ─── */}
      <div className="hidden lg:block">
        <section className="relative h-[88vh] min-h-[560px] max-h-[900px] flex items-center">
          <div className="absolute inset-0 bg-black">
            <img
              src={HERO_IMAGE_DESKTOP}
              srcSet={`${HERO_IMAGE_DESKTOP} 1920w, ${HERO_IMAGE_2X} 2170w`}
              sizes="100vw"
              alt="PITTY FIT athlete in gym"
              width={1920}
              height={641}
              className="w-full h-full object-cover object-[62%_center]"
              fetchPriority="high"
            />
            <div className="absolute inset-y-0 left-0 w-[58%] bg-gradient-to-r from-black/85 via-black/45 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 w-full px-6 lg:px-16">
            <div className="max-w-xl animate-fade-in-up">
              <p className="text-[11px] tracking-[0.28em] uppercase text-white mb-5">
                More than a brand
              </p>
              <h1 className="text-[2.75rem] sm:text-6xl lg:text-[4.5rem] font-black uppercase tracking-[0.02em] leading-[0.95] mb-10 text-white">
                It&apos;s a Mindset
              </h1>
              <Button to="/shop" variant="ghost">
                Shop Now →
              </Button>
            </div>
          </div>
        </section>

        <TrustBar />

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
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-[2px] sm:gap-[3px]">
              {categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
            </div>
          </div>
        </section>

        <section className="relative bg-black">
          <div className="absolute inset-0">
            <img
              src={SIGNATURE_BANNER}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover object-center"
            />
          </div>

          <div className="relative grid grid-cols-3 min-h-[480px]">
            <div aria-hidden="true" />

            <div className="bg-[#111111] flex flex-col items-center justify-center text-center px-8 py-16">
              <p className="text-[10px] tracking-[0.28em] uppercase text-white/45 mb-5">
                The Signature Collections.
              </p>
              <h2 className="text-[1.65rem] font-black uppercase tracking-[0.04em] leading-tight mb-6">
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

            <div aria-hidden="true" />
          </div>
        </section>
      </div>
    </>
  );
}
