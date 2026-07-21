// EmblaCarouselDotButton.tsx
'use client';

import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { EmblaCarouselType } from 'embla-carousel';

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

export const DotButton: React.FC<ComponentPropsWithRef<'button'>> = (props) => {
  const { children, ...restProps } = props;
  return (
    <button type='button' {...restProps}>
      {children}
    </button>
  );
};
