import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ProductImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ProductImageCarousel({ images, alt }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  if (images.length === 0) {
    return (
      <div className="w-full max-w-[480px] sm:max-w-[560px] mx-auto lg:mx-0">
        <div className="aspect-square bg-pitty-gray flex items-center justify-center text-white/40 text-sm">
          No image available
        </div>
      </div>
    );
  }

  const goTo = (index: number) => {
    setCurrentIndex((index + images.length) % images.length);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (touchStartX.current === null) return;

    const diff = touchStartX.current - event.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? currentIndex + 1 : currentIndex - 1);
    }
    touchStartX.current = null;
  };

  const hasMultiple = images.length > 1;

  return (
    <div className="space-y-3 w-full max-w-[480px] sm:max-w-[560px] mx-auto lg:mx-0">
      <div
        className="relative aspect-square bg-pitty-gray overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((src, index) => (
            <img
              key={`${src}-${index}`}
              src={src}
              alt={`${alt} - image ${index + 1}`}
              className="h-full w-full min-w-full flex-shrink-0 object-cover"
            />
          ))}
        </div>

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(currentIndex - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={() => goTo(currentIndex + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, index) => (
            <button
              key={`thumb-${src}-${index}`}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-24 h-24 overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-white' : 'border-white/20 hover:border-white/50'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
