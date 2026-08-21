'use client';
import React, { useRef, useEffect } from 'react';
import { loadSplitText, whenNearViewport } from '@/lib/gsap-loader';

type TextRevealProps = {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
  }>;
  delay?: number;
  triggerRef?: React.RefObject<HTMLElement | null>;
  start?: string;
  duration?: number;
};

export default function TextReveal({
  children,
  delay = 0,
  duration = 0.4,
  triggerRef,
  start = 'top 80%',
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let split: import('gsap/SplitText').SplitText | undefined;
    let cancelled = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    fallbackTimer = setTimeout(() => {
      if (!cancelled && el) el.style.opacity = '1';
    }, 2500);

    const stopWatching = whenNearViewport(el, () => {
      loadSplitText()
        .then(async (SplitText) => {
          if (cancelled || !containerRef.current) return;
          const { gsap } = await import('gsap');

          await document.fonts.ready;
          if (cancelled || !containerRef.current) return;

          split = SplitText.create(containerRef.current, {
            type: 'lines',
            mask: 'lines',
            linesClass: 'line++',
          });

          clearTimeout(fallbackTimer);

          gsap.set(containerRef.current, { opacity: 1 });

          gsap.set(split.lines, {
            y: '110%',
            opacity: 0,
            filter: 'blur(6px)',
          });

          gsap.to(split.lines, {
            y: '0%',
            opacity: 1,
            filter: 'blur(0px)',
            duration,
            delay,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: triggerRef?.current ?? containerRef.current,
              start,
              once: true,
            },
          });
        })
        .catch(() => {
          if (!cancelled && containerRef.current) {
            containerRef.current.style.opacity = '1';
          }
        });
    });

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      stopWatching();
      split?.revert();
    };
  }, [delay, duration, start, triggerRef]);

  return React.cloneElement(children, {
    ref: containerRef,
    style: { opacity: 0 },
  });
}
