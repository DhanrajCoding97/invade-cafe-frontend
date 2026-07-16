'use client';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
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
  const enteredRef = useRef(false);
  const formReadyRef = useRef(false);

  function maybePlay() {
    if (enteredRef.current && formReadyRef.current) {
      tlRef.current.play();
    }
  }

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const tl = tlRef.current;

      tl.fromTo(
        eyebrowRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
        0,
      );

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          enteredRef.current = true;
          maybePlay(); // safe now — reads formReadyRef.current fresh every call
        },
      });
    },
    { scope: sectionRef },
  );

  function handleFormReady() {
    formReadyRef.current = true;
    maybePlay(); // call directly, no effect/state indirection needed
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }

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
        <BookingForm timeline={tlRef.current} onReady={handleFormReady} />
      </div>
    </section>
  );
}
