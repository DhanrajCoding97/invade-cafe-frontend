// 'use client';
// import { useEffect, useRef } from 'react';
// import Lenis from 'lenis';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { isTouchDevice } from '@/lib/lenisInstance';
// gsap.registerPlugin(ScrollTrigger);

// export default function SmoothScroll({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const lenisRef = useRef<Lenis | null>(null);

//   useEffect(() => {
//      const isTouch = isTouchDevice();
    
//     if (isTouch) {
//       const normalizer = ScrollTrigger.normalizeScroll({
//         allowNestedScroll: true,
//       });
//       return () => normalizer?.kill();
//     }

//     const lenis = new Lenis({
//       duration: 1.2,
//       smoothWheel: true,
//     });
//     lenisRef.current = lenis;

//     const update = (time: number) => lenis.raf(time * 1000);

//     lenis.on('scroll', ScrollTrigger.update);
//     gsap.ticker.add(update);
//     gsap.ticker.lagSmoothing(0);

//     return () => {
//       gsap.ticker.remove(update);
//       lenis.destroy();
//       lenisRef.current = null;
//     };
//   }, []);

//   return children;
// }

'use client';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getLenisInstance, destroyLenis, isTouchDevice } from "@/lib/lenisInstance"

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isTouchDevice()) {
      const normalizer = ScrollTrigger.normalizeScroll({
        allowNestedScroll: true,
      });
      return () => normalizer?.kill();
    }

    // Use the same singleton the navbar uses
    getLenisInstance();

    return () => {
      destroyLenis();
    };
  }, []);

  return children;
}
