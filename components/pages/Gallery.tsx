'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from '../GsapTextAnimation';
import { VideoImageCarousel, type Slide } from '../carousel/VideoImageCarouse';
gsap.registerPlugin(ScrollTrigger);

const CarouselSlides: Slide[] = [
  { type: 'image', src: '/cafe-image-2.webp', alt: 'PS5 lounge setup' },
  { type: 'video', src: '/videos/cafe-video-4.webm' },
  { type: 'image', src: '/cafe-image-5.webp', alt: 'PS5 lounge setup' },
  { type: 'image', src: '/cafe-image-6.webp', alt: 'Racing sim rig' },
  { type: 'video', src: '/videos/cafe-video-4.webm' },
  { type: 'image', src: '/gallery5.webp', alt: 'Racing sim rig' },
  { type: 'image', src: '/gallery6.webp', alt: 'Racing sim rig' },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const eyebrowLineRef = useRef<HTMLDivElement>(null);

  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  const linesRef = useRef<{
    eyebrowText?: HTMLElement[];
    heading?: HTMLElement[];
    desc?: HTMLElement[];
  }>({});

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const tl = tlRef.current;
      const lines = linesRef.current;

      // Wait for fonts so SplitText line breaks (and thus trigger start
      // positions) are computed against final layout — matters most on
      // mobile where font swap shifts height proportionally more.
      document.fonts.ready.then(() => {
        tl.clear();

        tl.addLabel('eyebrowStart', 0)
          .fromTo(
            eyebrowLineRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
            'eyebrowStart',
          )
          .to(
            lines.eyebrowText ?? [],
            { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
            'eyebrowStart',
          )

          .addLabel('headingStart', '-=0.3')
          .to(
            lines.heading ?? [],
            { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
            'headingStart',
          )

          .addLabel('descStart', '-=0.4')
          .to(
            lines.desc ?? [],
            { y: '0%', duration: 1, stagger: 0.1, ease: 'power4.out' },
            'descStart',
          )
          .fromTo(
            carouselRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4, ease: 'power4.inOut' },
            '-=0.5',
          );

        // Single ScrollTrigger drives the whole sequence
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
          onEnter: () => tl.play(),
        });
      });
    },
    { scope: sectionRef },
  );
  // useGSAP(
  //   () => {
  //     if (!sectionRef.current) return;
  //     const tl = tlRef.current;

  //     // Non-text pieces get added directly, positioned relative to each other
  //     tl.fromTo(
  //       eyebrowRef.current,
  //       { autoAlpha: 0, y: 20 },
  //       { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
  //       0, // starts at t=0 of the sequence
  //     );

  //     // Single ScrollTrigger drives the whole timeline
  //     ScrollTrigger.create({
  //       trigger: sectionRef.current,
  //       start: 'top 70%',
  //       once: true,
  //       onEnter: () => tl.play(),
  //     });
  //   },
  //   { scope: sectionRef },
  // );
  return (
    <section
      id='gallery'
      ref={sectionRef}
      className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py:16 lg:py-20 bg-black'
    >
      <div className='mx-auto max-w-6xl'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          <div ref={eyebrowLineRef} className='h-px w-8 bg-[#00d4ff]' />
          <GsapTextAnimation
            mode='controlled'
            onLinesReady={(lines) => {
              linesRef.current.eyebrowText = lines;
            }}
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              INSIDE THE CAFE
            </span>
          </GsapTextAnimation>
        </div>
        {/* main title */}
        <GsapTextAnimation
          mode='controlled'
          onLinesReady={(lines) => {
            linesRef.current.heading = lines;
          }}
        >
          <h1 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              Gallery
            </span>
          </h1>
        </GsapTextAnimation>
        {/* description */}
        <GsapTextAnimation
          mode='controlled'
          onLinesReady={(lines) => {
            linesRef.current.desc = lines;
          }}
        >
          <p className='mx-auto text-left text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]'>
            Explore the atmosphere, gaming setups, racing simulators, VR
            stations, and unforgettable moments from our café.
          </p>
        </GsapTextAnimation>
        <div ref={carouselRef} className='mt-6 sm:mt-8 md:mt-10 lg:mt-12'>
          <VideoImageCarousel slides={CarouselSlides} />
        </div>
      </div>
    </section>
  );
}
