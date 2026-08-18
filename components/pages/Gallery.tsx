'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import LineReveal from '../gsap/LineReveal';
import TextReveal from '../gsap/TextReveal';
import { GallerySkeleton } from '../skeletons/GallerySkeleton';
import { type Slide } from '../carousel/VideoImageCarousel';
const VideoImageCarousel = dynamic(
  () =>
    import('../carousel/VideoImageCarousel').then((mod) => ({
      default: mod.VideoImageCarousel,
    })),
  { loading: () => <GallerySkeleton />, ssr: false },
);
const CarouselSlides: Slide[] = [
  { type: 'image', src: '/cafe-image-2.webp', alt: 'PS5 lounge setup' },
  {
    type: 'video',
    src: '/videos/cafe-video-4.webm',
    poster: '/images/video-poster-1.webp',
  },
  { type: 'image', src: '/cafe-image-5.webp', alt: 'PS5 lounge setup' },
  { type: 'image', src: '/cafe-image-6.webp', alt: 'Racing sim rig' },
  {
    type: 'video',
    src: '/videos/cafe-video-1.webm',
    poster: '/images/video-poster-2.webp',
  },
  { type: 'image', src: '/gallery5.webp', alt: 'Racing sim rig' },
  { type: 'image', src: '/gallery6.webp', alt: 'Racing sim rig' },
];

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      id='gallery'
      ref={sectionRef}
      className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py:16 lg:py-20 bg-black'
    >
      <div className='mx-auto max-w-6xl'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          <LineReveal triggerRef={sectionRef} delay={0}>
            <div className='h-px w-8 bg-[#00d4ff]' />
          </LineReveal>
          <TextReveal triggerRef={sectionRef} delay={0.15}>
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              INSIDE THE CAFE
            </span>
          </TextReveal>
        </div>
        {/* main title */}
        <TextReveal triggerRef={sectionRef} delay={0.25}>
          <h2 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              Gallery
            </span>
          </h2>
        </TextReveal>
        {/* description */}
        <TextReveal triggerRef={sectionRef} delay={0.55}>
          <p className='py-2 max-w-[80ch] text-[clamp(0.78rem,2.2vw,1.125rem)] leading-[1.65] text-[#bcbcbc]'>
            Step inside and you'll find a space built for gamers — dedicated PC
            stations with proper gaming chairs, a PS5 corner for couch co-op and
            competitive play, sim racing rigs set up for a genuinely immersive
            driving experience, and a VR zone for stepping fully into the game.
            Take a look through our gallery to get a feel for the setups and
            atmosphere before you visit.
          </p>
        </TextReveal>
        <LineReveal triggerRef={sectionRef} delay={0.75}>
          <div className='opactiy-0 mt-8 md:mt-10 lg:mt-12 h-[60svh]'>
            <VideoImageCarousel slides={CarouselSlides} />
          </div>
        </LineReveal>
      </div>
    </section>
  );
}
