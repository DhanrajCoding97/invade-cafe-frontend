// import Lenis from 'lenis';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// let lenis: Lenis | null = null;
// export function getLenisInstance() {
//   if (!lenis) {
//     lenis = new Lenis({
//       duration: 1.2,
//       smoothWheel: true,
//     });
//     lenis.on('scroll', () => ScrollTrigger.update());
//     gsap.ticker.add((time) => {
//       lenis!.raf(time * 1000);
//     });
//     gsap.ticker.lagSmoothing(0);
//   }
//   return lenis;
// }

// export function destroyLenis() {
//   if (lenis) {
//     gsap.ticker.remove((time) => {
//       lenis!.raf(time * 1000);
//     });
//     lenis.destroy();
//     lenis = null;
//   }
// }

// lenisInstance.ts
// import Lenis from 'lenis';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// let lenis: Lenis | null = null;
// let resizeObserver: ResizeObserver | null = null;

// export function getLenisInstance() {
//   if (!lenis) {
//     lenis = new Lenis({
//       duration: 1.2,
//       smoothWheel: true,
//       syncTouch: true,
//     });

//     lenis.on('scroll', () => ScrollTrigger.update());

//     gsap.ticker.add((time) => {
//       lenis!.raf(time * 1000);
//     });
//     gsap.ticker.lagSmoothing(0);

//     // Any element on the page growing/shrinking (images loading, Swiper
//     // mounting, GSAP-set initial offsets resolving, etc.) changes total
//     // scroll height. ScrollTrigger caches pixel-based start/end values,
//     // so anything after the LAST scroll-triggered section (like the
//     // footer) needs a refresh whenever that happens, or its trigger
//     // point goes stale and scroll position never crosses it correctly.
//     let refreshTimeout: ReturnType<typeof setTimeout>;
//     resizeObserver = new ResizeObserver(() => {
//       clearTimeout(refreshTimeout);
//       refreshTimeout = setTimeout(() => {
//         ScrollTrigger.refresh();
//       }, 150); // debounced so rapid layout shifts don't thrash refresh
//     });
//     resizeObserver.observe(document.body);
//   }
//   return lenis;
// }

// export function destroyLenis() {
//   if (lenis) {
//     gsap.ticker.remove((time) => {
//       lenis!.raf(time * 1000);
//     });
//     lenis.destroy();
//     lenis = null;
//   }
//   if (resizeObserver) {
//     resizeObserver.disconnect();
//     resizeObserver = null;
//   }
// }

// lenisInstance.ts
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis: Lenis | null = null;
let resizeObserver: ResizeObserver | null = null;

export function isTouchDevice() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;
}

export function getLenisInstance() {
  // Don't create Lenis on touch devices — normalizeScroll owns scroll there.
  if (isTouchDevice()) return null;
// console.log('lenis created', lenis)
  if (!lenis) {
    // console.log('lenis created', lenis)
    lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      syncTouch: true, // no longer needed since touch never reaches here, but harmless
    });

    lenis.on('scroll', () => ScrollTrigger.update());

    gsap.ticker.add((time) => {
      lenis!.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    let refreshTimeout: ReturnType<typeof setTimeout>;
    resizeObserver = new ResizeObserver(() => {
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
    });
    resizeObserver.observe(document.body);
  }
  // console.log('lenins created')
  return lenis;
}

export function destroyLenis() {
  if (lenis) {
    gsap.ticker.remove((time) => {
      lenis!.raf(time * 1000);
    });
    lenis.destroy();
    lenis = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
}
