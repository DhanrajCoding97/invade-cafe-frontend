'use client';
import Badge from '@/app/components/neonblade-ui/badge';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { DatalinesWithGrid } from '@/app/components/neonblade-ui/datalines-with-grid';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { getLenisInstance } from '@/lib/lenisInstance';
import { playSectionTransition } from '@/lib/PageTransition';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  // const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  useEffect(() => {
    //reduce grid lines for mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile(); // set correct value on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);

    // Get the global Lenis instance
    const lenis = getLenisInstance();

    // Recalculate trigger positions once layout has settled
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);

    // Also refresh shortly after mount, covers images/fonts that load async
    const t = setTimeout(refresh, 300);

    // GSAP animations as normal
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-badge', {
      opacity: 0,
      y: -20,
      duration: 0.6,
    })
      .from(
        '.hero-heading',
        {
          opacity: 0,
          y: 40,
          duration: 0.9,
        },
        '-=0.3',
      )
      .from(
        '.hero-subtext',
        {
          opacity: 0,
          y: 20,
          duration: 0.7,
        },
        '-=0.5',
      )
      .from(
        '.hero-cta',
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.15,
        },
        '-=0.4',
      );

    // Ambient drift
    // gsap.to(".glow-cyan", {
    //   x: 30,
    //   y: 20,
    //   duration: 8,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: "sine.inOut",
    // })
    // gsap.to(".glow-fuchsia", {
    //   x: -30,
    //   y: -20,
    //   duration: 9,
    //   repeat: -1,
    //   yoyo: true,
    //   ease: "sine.inOut",
    // })
    gsap.to('.glow-cyan', {
      x: 80,
      y: 60,
      scale: 1.15,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
    gsap.to('.glow-fuchsia', {
      x: -70,
      y: -50,
      scale: 1.2,
      duration: 11,
      repeat: -1,
      yoyo: true,
      ease: 'power2.in',
      delay: 1.5, // offset so both blobs don't peak/trough in sync
    });

    // Cleanup
    return () => {
      window.removeEventListener('load', refresh);
      clearTimeout(t);
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id='hero'
      ref={containerRef}
      className='relative min-h-[94vh] w-full overflow-hidden bg-black sm:min-h-screen'
    >
      <div className='glow-cyan pointer-events-none absolute -top-40 -left-40 z-0 h-125 w-125 rounded-full bg-cyan-500/20 blur-[120px]' />
      <div className='glow-fuchsia pointer-events-none absolute -right-40 -bottom-40 z-0 h-150 w-150 rounded-full bg-fuchsia-500/20 blur-[130px]' />
      <DatalinesWithGrid
        lineColor='#38FA14'
        shadowColor='#071F02'
        cellSize={isMobile ? 40 : 60}
        maxLines={isMobile ? 4 : 8}
        baseSpeed={1.5}
        lineLength={isMobile ? 80 : 120}
        spawnProbability={isMobile ? 0.03 : 0.04}
        bgGridColor='rgba(0,255,102,0.06)'
        overlay
      />
      <div className='absolute inset-0 z-10 flex flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-12 lg:px-8 lg:py-20'>
        <div className='hero-badge'>
          <Badge
            responsive
            color='green'
            variant='outline'
            dot='pulse'
            glow={false}
          >
            <Image
              alt='controller icon'
              src={'./headerIcon.svg'}
              height={24}
              width={24}
              style={{ width: 24, height: 24 }}
            />
            Console Rentals Now Available
          </Badge>
        </div>
        <div className='relative mt-8 max-w-3xl text-center'>
          {/* Text-safety scrim — sits behind heading+subtext only */}
          <div
            className='pointer-events-none absolute inset-0 -z-10 rounded-[3rem] blur-2xl'
            style={{
              background:
                'radial-gradient(ellipse 100% 80% at center, rgba(0,0,0,0.65) 0%, transparent 75%)',
            }}
          />

          <h1 className='hero-heading bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Invade Gaming Cafe
            {/* <GlitchText customSpeed="3s" mode="active">
            </GlitchText> */}
          </h1>
          <p className='hero-subtext mx-auto mt-2 max-w-xl text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc] font-normal'>
            Laid-back hangout featuring PC and PlayStation games, plus racing
            simulators and VR options.
          </p>
        </div>
        <div className='hero-cta mt-10 flex w-full flex-col items-center justify-center gap-4 xs:flex-row'>
          <CornerCutButton
            onClick={() =>
              playSectionTransition(() => {
                getLenisInstance().scrollTo('#booking', { immediate: true });
              })
            }
            color='cyan'
            variant='solid'
            showArrow
            hoverEffect='shift'
            fullWidthOnMobile={true}
          >
            Book Now
          </CornerCutButton>
          <CornerCutButton
            onClick={() =>
              playSectionTransition(() => {
                getLenisInstance().scrollTo('#pricing', { immediate: true });
              })
            }
            color='green'
            variant='ghost'
            hoverEffect='pulse'
            glowIntensity='high'
            fullWidthOnMobile={true}
          >
            View Pricing
          </CornerCutButton>
        </div>
      </div>
    </section>
  );
}
