'use client';

import { useCallback, useEffect, useRef, useId, useState } from 'react';
import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import Ssr from 'embla-carousel-ssr';
import {
  NextButton,
  PrevButton,
  usePrevNextButtons,
} from './EmblaCarouselArrowButtons';
import { DotButton, useDotButton } from './EmblaCarouselDotButton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  pauseScrollNormalizer,
  resumeScrollNormalizer,
} from '@/lib/lenisInstance';

const TWEEN_FACTOR_BASE = 0.84;

const numberWithinRange = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export type Slide =
  | { type: 'image'; src: string; alt: string }
  | { type: 'video'; src: string; alt?: string; poster: string };

type VideoImageCarouselProps = {
  slides: Slide[];
  options?: EmblaOptionsType;
};

export function VideoImageCarousel({
  slides,
  options,
}: VideoImageCarouselProps) {
  const carouselId = useId().replace(/:/g, '');
  const [emblaRef, emblaApi, emblaServerApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'center',
      ...options,
    },
    [
      Ssr({
        slideSizes: slides.map(() => 85),
        breakpoints: {
          '(min-width: 640px)': { slideSizes: slides.map(() => 70) },
          '(min-width: 768px)': { slideSizes: slides.map(() => 60) },
        },
      }),
    ],
  );
  const renderSsrStyles = !emblaApi;
  const tweenFactor = useRef(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.snapList().length;
  }, []);

  const tweenOpacity = useCallback(
    (emblaApi: EmblaCarouselType, isScrollEvent = false) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const slidesInView = emblaApi.slidesInView();

      emblaApi.snapList().forEach((scrollSnap: number, snapIndex: number) => {
        let diffToTarget = scrollSnap - scrollProgress;
        const slidesInSnap = [snapIndex];

        slidesInSnap.forEach((slideIndex: number) => {
          if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

          if (engine.options.loop) {
            engine.slideLooper.loopPoints.forEach((loopItem) => {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                const sign = Math.sign(target);
                if (sign === -1)
                  diffToTarget = scrollSnap - (1 + scrollProgress);
                if (sign === 1)
                  diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            });
          }

          const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
          const focusOpacity = numberWithinRange(tweenValue, 0.3, 1);

          // Paint a black overlay instead of fading the slide itself —
          // the image/video stays fully opaque, no background bleed possible.
          const overlay = overlayRefs.current[slideIndex];
          if (overlay) overlay.style.opacity = (1 - focusOpacity).toString();
        });
      });
    },
    [],
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenFactor(emblaApi);
    tweenOpacity(emblaApi);

    const updateInView = () => setSlidesInView(emblaApi.slidesInView());
    updateInView();

    emblaApi
      .on('reinit', setTweenFactor)
      .on('reinit', () => tweenOpacity(emblaApi))
      .on('reinit', updateInView)
      .on('scroll', () => tweenOpacity(emblaApi, true))
      .on('slidefocus', () => tweenOpacity(emblaApi))
      .on('slidesinview', updateInView);
  }, [emblaApi, tweenFactor, tweenOpacity, setTweenFactor]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === selectedIndex) v.play().catch(() => {});
      else v.pause();
    });
  }, [selectedIndex]);

  return (
    <div className='w-w-full h-full '>
      {renderSsrStyles && (
        <style>
          {emblaServerApi
            .plugins()
            .ssr?.getStyles(`#${carouselId}`, '.embla__slide')}
        </style>
      )}
      <div
        className='overflow-hidden h-full embla__root'
        ref={emblaRef}
        onPointerDown={pauseScrollNormalizer}
        onPointerUp={resumeScrollNormalizer}
        onPointerCancel={resumeScrollNormalizer}
        onPointerLeave={resumeScrollNormalizer}
      >
        <div className='flex h-full'>
          {slides.map((slide, index) => (
            <div
              key={index}
              className='min-w-0 shrink-0 grow-0 basis-[85%] px-2 sm:basis-[70%] md:basis-[60%]'
            >
              <div
                className={cn(
                  'embla__viewport relative h-full w-full overflow-hidden rounded-lg bg-black transition-all duration-500 ease-out',
                  index === selectedIndex
                    ? 'scale-100 shadow-2xl shadow-cyan-500/20'
                    : 'scale-[0.93]',
                )}
              >
                {slide.type === 'image' ? (
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    sizes='(min-width: 768px) 60vw, (min-width: 640px) 70vw, 85vw'
                    className='object-cover'
                    priority={index === 0}
                  />
                ) : (
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    src={slide.src}
                    poster={slide.poster}
                    muted
                    loop
                    playsInline
                    preload='none'
                    aria-hidden='true'
                    className='h-full w-full object-cover'
                  />
                )}

                {/* Dimming overlay — replaces opacity-based fade, zero bleed-through */}
                <div
                  ref={(el) => {
                    overlayRefs.current[index] = el;
                  }}
                  className={cn(
                    'pointer-events-none absolute inset-0 bg-black transition-opacity duration-500 ease-out',
                    index === selectedIndex ? 'opacity-0' : 'opacity-40',
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
        <div className='flex gap-0.5'>
          {' '}
          {/* was gap-2 — tighter gap now that the button itself is smaller */}
          {scrollSnaps.map((_, index) => (
            <DotButton
              slide={slides[index]}
              isSelected={index === selectedIndex}
              key={index}
              onClick={() => onDotButtonClick(index)}
              dotClassName={`h-2 w-2 rounded-full transition-colors duration-300 ease-in ${
                index === selectedIndex
                  ? 'bg-cyan-400'
                  : 'bg-white/25 hover:bg-cyan-400'
              }`}
            />
          ))}
        </div>
        <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
      </div>
    </div>
  );
}
