// lib/gsap-loader.ts
// Lazily loads gsap + ScrollTrigger once, shared across every reveal component.
// Nothing here runs until a component actually calls loadGsapCore() —
// so gsap's JS never ships in the initial bundle for above-the-fold sections
// that don't use these wrappers.

import type { gsap as GsapType } from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

type GsapCore = {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
};

let corePromise: Promise<GsapCore> | null = null;

export function loadGsapCore(): Promise<GsapCore> {
  if (!corePromise) {
    corePromise = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]).then(([gsapMod, stMod]) => {
      const gsap = gsapMod.gsap;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      return { gsap, ScrollTrigger };
    });
  }
  return corePromise;
}

// SplitText is a paid/heavier plugin — kept in its own loader so components
// that don't need text-splitting (LineReveal, CardsReveal) never pull it in.
let splitTextPromise: Promise<
  typeof import('gsap/SplitText').SplitText
> | null = null;

export function loadSplitText() {
  if (!splitTextPromise) {
    splitTextPromise = loadGsapCore().then(({ gsap }) =>
      import('gsap/SplitText').then((mod) => {
        gsap.registerPlugin(mod.SplitText);
        return mod.SplitText;
      }),
    );
  }
  return splitTextPromise;
}

// Only loads gsap once an element is near the viewport, instead of the
// moment the component mounts. This matters for below-the-fold sections:
// the ~30-40kb gsap+ScrollTrigger JS doesn't even get requested until the
// user is close to scrolling into that section.
export function whenNearViewport(
  el: Element,
  callback: () => void,
  rootMargin = '300px',
) {
  if (typeof IntersectionObserver === 'undefined') {
    callback(); // SSR/old-browser fallback — just run it
    return () => {};
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        callback();
        observer.disconnect();
      }
    },
    { rootMargin },
  );
  observer.observe(el);
  return () => observer.disconnect();
}
