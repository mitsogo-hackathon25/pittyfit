import { LOGO_IMAGE } from '../constants/images';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  light?: boolean;
}

export default function Logo({ size = 'md', light = true }: LogoProps) {
  const sizes = {
    sm: { icon: 'w-11 h-11', title: 'text-lg', tagline: 'text-[7px]' },
    md: { icon: 'w-14 h-14', title: 'text-xl', tagline: 'text-[8px]' },
    lg: { icon: 'w-16 h-16', title: 'text-2xl', tagline: 'text-[9px]' },
  };
  const s = sizes[size];
  const color = light ? 'text-white' : 'text-black';

  return (
    <div className="flex items-center gap-3">
      <img
        src={LOGO_IMAGE}
        alt=""
        aria-hidden="true"
        className={`${s.icon} object-contain flex-shrink-0`}
      />
      <div className="flex flex-col items-start leading-none">
        <div
          className={`${s.title} font-black italic tracking-[0.08em] uppercase ${color}`}
          style={{ transform: 'skewX(-6deg)' }}
        >
          PITTY FIT
        </div>
        <div
          className={`${s.tagline} tracking-[0.14em] uppercase mt-1 opacity-70 ${color}`}
        >
          Discipline and Consistency
        </div>
      </div>
    </div>
  );
}
