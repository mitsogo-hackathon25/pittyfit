import { Dumbbell, Heart, Leaf, ShieldCheck, Truck } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'FREE SHIPPING', subtitle: 'ON ORDERS OVER $75' },
  { icon: ShieldCheck, title: 'SECURE CHECKOUT', subtitle: 'SHOP WITH CONFIDENCE' },
  { icon: Dumbbell, title: 'PREMIUM QUALITY', subtitle: 'BUILT FOR PERFORMANCE' },
  { icon: Leaf, title: 'SUSTAINABLE PACKAGING', subtitle: 'A CLEANER TOMORROW' },
  { icon: Heart, title: 'WOMEN OWNED', subtitle: 'STRONGER TOGETHER' },
];

export default function TrustBar() {
  return (
    <section className="bg-black border-t border-white/10">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {FEATURES.map((feature, index) => (
          <div
            key={feature.title}
            className={`flex flex-col items-center justify-center text-center px-4 py-7 gap-2.5 ${
              index < FEATURES.length - 1 ? 'lg:border-r lg:border-white/15' : ''
            } ${index % 2 === 0 && index < 4 ? 'border-r border-white/10 sm:border-r-0' : ''}`}
          >
            <feature.icon size={22} strokeWidth={1.25} className="text-white" />
            <div>
              <p className="text-[10px] font-semibold tracking-[0.12em] uppercase leading-tight">
                {feature.title}
              </p>
              <p className="text-[9px] text-white/45 tracking-[0.08em] uppercase mt-1 leading-tight">
                {feature.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
