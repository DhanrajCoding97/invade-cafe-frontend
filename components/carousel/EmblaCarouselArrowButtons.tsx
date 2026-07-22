// EmblaCarouselArrowButtons.tsx
'use client';

import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined,
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.goToPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.goToNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canGoToPrev()); // was canScrollPrev()
    setNextBtnDisabled(!emblaApi.canGoToNext()); // was canScrollNext()
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on('reinit', onSelect).on('select', onSelect); // was 'reInit'
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

export const PrevButton: React.FC<ComponentPropsWithRef<'button'>> = (
  props,
) => {
  const { children, ...restProps } = props;

  return (
    <button
      type='button'
      className='flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:border-white/40 disabled:opacity-30 cursor-pointer'
      {...restProps}
    >
      <svg viewBox='0 0 24 24' fill='none' className='h-4 w-4'>
        <path
          d='M15 18l-6-6 6-6'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      {children}
    </button>
  );
};

export const NextButton: React.FC<ComponentPropsWithRef<'button'>> = (
  props,
) => {
  const { children, ...restProps } = props;

  return (
    <button
      type='button'
      className='flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:border-white/40 disabled:opacity-30 cursor-pointer'
      {...restProps}
    >
      <svg viewBox='0 0 24 24' fill='none' className='h-4 w-4'>
        <path
          d='M9 18l6-6-6-6'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
      {children}
    </button>
  );
};
