import { Dumbbell, Leaf } from 'lucide-react';

export default function BrandValues() {
  return (
    <section className="bg-black border-y border-white/10">
      <div className="grid grid-cols-2 divide-x divide-white/10">
        <div className="flex flex-col items-center justify-center text-center px-4 py-10 sm:py-12 gap-3">
          <Dumbbell size={22} strokeWidth={1.25} className="text-white" />
          <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase leading-snug">
            Built for Performance
          </p>
        </div>
        <div className="flex flex-col items-center justify-center text-center px-4 py-10 sm:py-12 gap-3">
          <Leaf size={22} strokeWidth={1.25} className="text-white" />
          <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.14em] uppercase leading-snug">
            Made for a Brighter Tomorrow
          </p>
        </div>
      </div>
    </section>
  );
}
