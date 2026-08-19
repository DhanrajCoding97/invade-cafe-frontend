'use client';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from '../GsapTextAnimation';
import { BookingFormSkeleton } from '../skeletons/BookingSkeleton';
import LineReveal from '../gsap/LineReveal';
import TextReveal from '../gsap/TextReveal';
// gsap.registerPlugin(ScrollTrigger);
// ScrollTrigger.config({ ignoreMobileResize: true });

const BookingForm = dynamic(() => import('../BookingForm'), {
  loading: () => <BookingFormSkeleton />,
});

export default function BookingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowLineRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const linesRef = useRef<{
    eyebrowText?: HTMLElement[];
    heading?: HTMLElement[];
    desc?: HTMLElement[];
  }>({});
  const enteredRef = useRef(false);
  const formReadyRef = useRef(false);

  function maybePlay() {
    if (enteredRef.current && formReadyRef.current) {
      tlRef.current.play();
    }
  }

  // useGSAP(
  //   () => {
  //     if (!sectionRef.current) return;
  //     const tl = tlRef.current;
  //     const lines = linesRef.current;

  //     document.fonts.ready.then(() => {
  //       tl.clear();

  //       tl.addLabel('eyebrowStart', 0)
  //         .fromTo(
  //           eyebrowLineRef.current,
  //           { autoAlpha: 0, y: 20 },
  //           { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
  //           'eyebrowStart',
  //         )
  //         .to(
  //           lines.eyebrowText ?? [],
  //           { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
  //           'eyebrowStart',
  //         )

  //         .addLabel('headingStart', '-=0.3')
  //         .to(
  //           lines.heading ?? [],
  //           { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
  //           'headingStart',
  //         )

  //         .addLabel('descStart', '-=0.4')
  //         .to(
  //           lines.desc ?? [],
  //           { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
  //           'descStart',
  //         );
  //       ScrollTrigger.create({
  //         trigger: sectionRef.current,
  //         start: 'top 70%',
  //         once: true,
  //         onEnter: () => {
  //           enteredRef.current = true;
  //           maybePlay(); // safe now — reads formReadyRef.current fresh every call
  //         },
  //       });
  //     });
  //   },
  //   { scope: sectionRef },
  // );

  function handleFormReady() {
    formReadyRef.current = true;
    maybePlay(); // call directly, no effect/state indirection needed
    // requestAnimationFrame(() => ScrollTrigger.refresh());
  }

  return (
    <section
      id='booking'
      ref={sectionRef}
      className='px-4 sm:px-6 lg:px-8 bg-black py-8 sm:py-12 md:py:16 lg:py-20'
    >
      <div className='mx-auto max-w-6xl'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          {/* <LineReveal delay={0} duration={0.5}>
          </LineReveal> */}
          <div ref={eyebrowLineRef} className='h-px w-8 bg-[#00d4ff]' />
          {/* <GsapTextAnimation
            mode='controlled'
            onLinesReady={(lines) => {
              linesRef.current.eyebrowText = lines;
            }}
          >
          </GsapTextAnimation> */}
          {/* <TextReveal triggerRef={sectionRef} delay={0.15}>
          </TextReveal> */}
          <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
            LOCK IN. LEVEL UP
          </span>
        </div>
        {/* main title */}
        {/* <GsapTextAnimation
          mode='controlled'
          onLinesReady={(lines) => {
            linesRef.current.heading = lines;
          }}
        >        </GsapTextAnimation> */}
        {/* <TextReveal triggerRef={sectionRef} delay={0.25}>
        </TextReveal> */}
        <h2 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Claim Your Rig
          </span>
        </h2>
        {/* description */}
        {/* <GsapTextAnimation
          mode='controlled'
          onLinesReady={(lines) => {
            linesRef.current.desc = lines;
          }}
        >
        </GsapTextAnimation> */}
        {/* <TextReveal triggerRef={sectionRef} delay={0.55}>
        </TextReveal> */}
        <p className='py-2 max-w-[80ch] text-left text-[clamp(0.78rem,2.2vw,1.125rem)] leading-[1.65] text-[#bcbcbc]'>
          Ready to play? Reserve your station in advance — from competitive
          gaming PCs to VR headsets and sim racing rigs — and skip the wait.
          Booking online takes seconds and guarantees your setup is ready the
          moment you arrive.
        </p>
        <BookingForm />
      </div>
    </section>
  );
}
