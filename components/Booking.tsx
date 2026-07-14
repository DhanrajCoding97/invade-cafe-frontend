'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
// import BookingForm from './BookingForm';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { BookingFormSkeleton } from './skeletons/BookingSkeleton';

const BookingForm = dynamic(() => import('./BookingForm'), {
  loading: () => <BookingFormSkeleton />,
});

export default function BookingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);

  // gsap scrollTrigger animation
  useGSAP(
    () => {
      gsap.from([eyebrowRef.current, titleRef.current, descRef.current], {
        opacity: 0,
        y: 30,
        delay: 1,
        duration: 0.4,
        ease: 'power2.out',
        stagger: 0.3,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      id='booking'
      ref={sectionRef}
      className='bg-black px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20'
    >
      <div className='mx-auto max-w-6xl'>
        {/* sub title */}
        <div ref={eyebrowRef} className='my-4 flex items-center gap-4'>
          <div className='h-px w-8 bg-[#00d4ff]' />
          <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
            LOCK IN. LEVEL UP.
          </span>
        </div>
        {/* main title */}
        <h2
          ref={titleRef}
          className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-left text-[clamp(2rem,.7174rem+3.913vw,3.75rem)] font-extrabold text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'
        >
          Claim Your Rig
        </h2>
        {/* description */}
        <p
          ref={descRef}
          className='mx-auto text-left text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]'
        >
          Reserve From competitive PCs to VR and Sim Racing
        </p>
        <BookingForm />
      </div>
    </section>
  );
}
