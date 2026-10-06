import { INSTAGRAM_IMAGES } from '../constants/images';

export default function InstagramFeed() {
  return (
    <section className="bg-black py-10 sm:py-12">
      <div className="flex items-center gap-4 px-6 mb-6">
        <div className="flex-1 h-px bg-white/15" />
        <h2 className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-white/50 whitespace-nowrap">
          Follow the Movement
        </h2>
        <div className="flex-1 h-px bg-white/15" />
      </div>

      <div className="grid grid-cols-4 gap-[2px] px-[2px]">
        {INSTAGRAM_IMAGES.map((src, i) => (
          <a
            key={i}
            href="#"
            className="aspect-square overflow-hidden bg-[#1a1a1a]"
            aria-label={`Instagram photo ${i + 1}`}
          >
            <img
              src={src}
              alt="PITTY FIT community"
              className="w-full h-full min-h-full object-cover object-center hover:scale-105 transition-transform duration-500"
              loading="eager"
              decoding="async"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
