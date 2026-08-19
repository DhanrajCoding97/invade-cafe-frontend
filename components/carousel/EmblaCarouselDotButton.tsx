// EmblaCarouselDotButton.tsx
'use client';
import { type Slide } from './VideoImageCarousel';
import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { EmblaCarouselType } from 'embla-carousel';
interface DotButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  slide: Slide;
  isSelected: boolean;
  dotClassName?: string; // new
}

type UseDotButtonType = {
  selectedIndex: number;
  scrollSnaps: number[];
  onDotButtonClick: (index: number) => void;
};

export const useDotButton = (
  emblaApi: EmblaCarouselType | undefined,
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.goTo(index); // was scrollTo(index)
    },
    [emblaApi],
  );

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.snapList()); // was scrollSnapList()
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedSnap()); // was selectedScrollSnap()
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi
      .on('reinit', onInit) // was 'reInit'
      .on('reinit', onSelect)
      .on('select', onSelect);
  }, [emblaApi, onInit, onSelect]);

  return { selectedIndex, scrollSnaps, onDotButtonClick };
};

// DotButton.tsx
export const DotButton: React.FC<DotButtonProps> = ({
  slide,
  isSelected,
  dotClassName, // renamed — styles the visual dot, not the button
  ...restProps
}) => {
  const label = slide.alt ?? (slide.type === 'video' ? 'video slide' : 'slide');

  return (
    <button
      className='flex h-11 w-8 shrink-0 items-center justify-center' // touch target — never overridden
      aria-label={`Go to ${label}`}
      aria-current={isSelected ? 'true' : undefined}
      type='button'
      {...restProps}
    >
      <span className={dotClassName} /> {/* the actual visible dot */}
    </button>
  );
};
