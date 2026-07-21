'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    if (isTouch) {
      // Let native scroll drive ScrollTrigger, no Lenis
      ScrollTrigger.normalizeScroll(true); // optional, smooths iOS rubber-banding
      return;
    }

    if (!lenis) {
      lenis = new Lenis({
        duration: 1.2,
        smoothWheel: true,
      });

      const update = (time: number) => lenis!.raf(time * 1000);

      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(update);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(update);
        lenis?.destroy();
        lenis = null;
      };
    }
  }, []);

  return children;
}