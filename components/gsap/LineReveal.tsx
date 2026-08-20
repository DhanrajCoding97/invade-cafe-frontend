'use client';

import React, { useRef, useEffect } from 'react';
import { loadGsapCore, whenNearViewport } from '@/lib/gsap-loader';

type LineRevealProps = {
  children: React.ReactElement<{
    ref?: React.Ref<HTMLElement>;
    className?: string;
    style?: React.CSSProperties;
  }>;
  delay?: number;
  duration?: number;
  start?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

export default function LineReveal({
  children,
  delay = 0,
  duration = 0.5,
  start = 'top 80%',
  triggerRef,
}: LineRevealProps) {
  const elRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    let cancelled = false;
    let fallbackTimer: ReturnType<typeof setTimeout> | undefined;

    // Fail-open: if gsap never loads, force-reveal after a short wait
    // instead of leaving the element permanently hidden.
    fallbackTimer = setTimeout(() => {
      if (!cancelled && el) el.style.opacity = '1';
    }, 2500);

    const stopWatching = whenNearViewport(el, () => {
      loadGsapCore()
        .then(({ gsap }) => {
          if (cancelled || !elRef.current) return;
          clearTimeout(fallbackTimer);

          // Plain opacity — no `autoAlpha`/visibility toggle here, so this
          // text stays in the accessibility tree and crawlable at all times,
          // just visually transparent until it animates in.
          gsap.fromTo(
            elRef.current,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration,
              delay,
              ease: 'power4.inOut',
              scrollTrigger: {
                trigger: triggerRef?.current ?? elRef.current,
                start,
                once: true,
              },
            },
          );
        })
        .catch(() => {
          if (!cancelled && elRef.current) {
            elRef.current.style.opacity = '1';
          }
        });
    });

    return () => {
      cancelled = true;
      clearTimeout(fallbackTimer);
      stopWatching();
    };
  }, [delay, duration, start, triggerRef]);

  return React.cloneElement(children, {
    ref: elRef,
    style: { opacity: 0 },
  });
}
