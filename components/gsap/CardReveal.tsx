'use client';
import React, { useRef, useEffect } from 'react';
import { loadGsapCore, whenNearViewport } from '@/lib/gsap-loader';
type CardsRevealProps = {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLDivElement>;
    className?: string;
    style?: React.CSSProperties;
  }>;
  delay?: number;
  stagger?: number;
  duration?: number;
  y?: number;
  start?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

export default function CardsReveal({
  children,
  delay = 0,
  stagger = 0.15,
  duration = 0.4,
  y = 48,
  start = 'top 80%',
  triggerRef,
}: CardsRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    // Fail-open: if gsap never loads, force-reveal every card after a
    // short wait instead of leaving the grid permanently hidden.
    fallbackTimer = setTimeout(() => {
      if (cancelled || !container) return;
      Array.from(container.children).forEach((card) => {
        (card as HTMLElement).style.visibility = 'visible';
        (card as HTMLElement).style.opacity = '1';
      });
    }, 2500);

    const stopWatching = whenNearViewport(container, () => {
      loadGsapCore()
        .then(({ gsap }) => {
          if (cancelled || !containerRef.current) return;
          clearTimeout(fallbackTimer);

          const cards = Array.from(containerRef.current.children);

          gsap.set(containerRef.current, { autoAlpha: 1 });

          // StrictMode's second mount: already played once — force-show
          // instead of re-hiding and waiting on a ScrollTrigger that
          // already passed.
          if (playedRef.current) {
            gsap.set(cards, { autoAlpha: 1, y: 0 });
            return;
          }

          // autoAlpha kept intentionally here (unlike LineReveal/TextReveal):
          // these are interactive card elements, so we also want
          // pointer-events/tab-focus disabled via visibility:hidden while
          // off-screen, not just visually transparent.
          gsap.set(cards, { autoAlpha: 0, y });

          gsap.to(cards, {
            autoAlpha: 1,
            y: 0,
            duration,
            stagger,
            delay,
            ease: 'power4.inOut',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: triggerRef?.current ?? containerRef.current,
              start,
              once: true,
            },
            onStart: () => {
              playedRef.current = true;
            },
          });
        })
        .catch(() => {
          if (cancelled || !containerRef.current) return;
          Array.from(containerRef.current.children).forEach((card) => {
            (card as HTMLElement).style.visibility = 'visible';
            (card as HTMLElement).style.opacity = '1';
          });
        });
    });

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      stopWatching();
    };
  }, [delay, stagger, duration, y, start, triggerRef]);

  return React.cloneElement(children, { ref: containerRef });
}
