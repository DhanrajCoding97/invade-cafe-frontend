'use client';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from './GsapTextAnimation';
import { BookingFormSkeleton } from './skeletons/BookingSkeleton';
gsap.registerPlugin(ScrollTrigger);
const BookingForm = dynamic(() => import('./BookingForm'), {
  loading: () => <BookingFormSkeleton />,
});

export default function BookingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const tl = tlRef.current;

      // Non-text pieces get added directly, positioned relative to each other
      tl.fromTo(
        eyebrowRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
        0, // starts at t=0 of the sequence
      );
      // Cards, same shared timeline
      // const cards = cardsRef.current?.children;
      // if (cards) {
      //   gsap.set(cards, { autoAlpha: 0, y: 48 });
      //   tl.to(
      //     cards,
      //     {
      //       autoAlpha: 1,
      //       y: 0,
      //       delay: 0.3,
      //       duration: 0.6,
      //       ease: 'power4.out',
      //       stagger: 0.3,
      //     },
      //     '>-0.1',
      //   );
      // }

      // Single ScrollTrigger drives the whole timeline
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => tl.play(),
      });
    },
    { scope: sectionRef },
  );
  // // gsap scrollTrigger animation
  // useGSAP(
  //   () => {
  //     gsap.from([eyebrowRef.current, titleRef.current, descRef.current], {
  //       opacity: 0,
  //       y: 30,
  //       delay: 1,
  //       duration: 0.4,
  //       ease: 'power2.out',
  //       stagger: 0.3,
  //       scrollTrigger: {
  //         trigger: sectionRef.current,
  //         start: 'top 75%',
  //         toggleActions: 'play none none none',
  //       },
  //     });
  //   },
  //   { scope: sectionRef },
  // );

  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section
      id='booking'
      ref={sectionRef}
      className='bg-black px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20'
    >
      <div className='mx-auto max-w-6xl'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          <div ref={eyebrowRef} className='h-px w-8 bg-[#00d4ff]' />
          <GsapTextAnimation
            animateOnScroll={false} // irrelevant now — timeline prop takes over
            delay={0}
            timeline={tlRef.current}
            position='<' // starts alongside the eyebrow line
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              LOCK IN. LEVEL UP
            </span>
          </GsapTextAnimation>
        </div>
        {/* main title */}
        <GsapTextAnimation
          animateOnScroll={false}
          delay={0}
          timeline={tlRef.current}
          position='-=0.3' // starts slightly before the previous item finishes
        >
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              Claim Your Rig
            </span>
          </h1>
        </GsapTextAnimation>
        {/* description */}
        <GsapTextAnimation
          animateOnScroll={false}
          delay={0}
          timeline={tlRef.current}
          position='-=0.4' // starts slightly before the previous item finishes
        >
          <p className='mx-auto text-left text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]'>
            Reserve From competitive PCs to VR and Sim Racing
          </p>
        </GsapTextAnimation>
        <BookingForm timeline={tlRef.current} />
      </div>
    </section>
  );
}
