'use client';
import { Review } from '@/types';
import { Marquee } from './ui/marquee';
import NeonGlowCornerCutCard from '@/app/components/neonblade-ui/neon-glow-corner-cut-card';
import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from './GsapTextAnimation';

gsap.registerPlugin(ScrollTrigger);

const reviews: Review[] = [
  {
    id: '1',
    name: 'Sujit Chaudhary',
    rating: 5,
    text: 'Best gaming cafe in navi mumbai. They have driving simulator and 120 htz games.must visit',
  },
  {
    id: '2',
    name: 'Prashant Singh',
    rating: 5,
    text: 'Amazing gaming experience! Great PCs, fast internet, friendly staff, and a comfortable atmosphere. Highly recommended for gamers',
  },
  {
    id: '3',
    name: 'Dilgith Dileepkumar',
    rating: 5,
    text: 'I absolutely adore the variety of games here! 🎮 The driving simulator, especially for Euro Truck 2, is fantastic. Highly recommend for a fun time! 🕹️👍',
  },
  {
    id: '4',
    name: 'Pranay Mhatre',
    rating: 5,
    text: 'Nice ambience and nice staff good communication',
  },
  {
    id: '5',
    name: 'Tejas Jain',
    rating: 4,
    text: "The best gaming cafe I've been to in recent times..they have Pc gaming with high graphics and Ps5 with 120hz Screens🤩 I thoroughly enjoyed their Sim Racing experience for Forza Horizon and F1!!! Don't wait just go🙌",
  },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

// gsap animations

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLParagraphElement>(null);
  const marqueeRef = useRef<HTMLParagraphElement>(null);

  // useGSAP(
  //   () => {
  //     gsap.from(
  //       [
  //         eyebrowRef.current,
  //         titleRef.current,
  //         descRef.current,
  //         marqueeRef.current,
  //       ],
  //       {
  //         opacity: 0,
  //         // y: 30,
  //         // duration: 0.8,
  //         // ease: "power2.out",
  //         // stagger: 0.45,
  //         ...REVEAL.header,
  //         scrollTrigger: {
  //           trigger: sectionRef.current,
  //           start: 'top 75%',
  //           toggleActions: 'play none none none',
  //         },
  //       },
  //     );
  //     const cards = cardsRef.current?.children;

  //     if (cards) {
  //       gsap.from(cards, {
  //         opacity: 0,
  //         y: 50,
  //         duration: 0.6,
  //         delay: 0.4,
  //         ease: 'sine.inOut',
  //         stagger: 0.3,
  //         scrollTrigger: {
  //           trigger: cardsRef.current,
  //           start: 'top 80%',
  //           toggleActions: 'play none none none',
  //         },
  //       });
  //     }
  //   },
  //   { scope: sectionRef },
  // );
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
      const cards = cardsRef.current?.children;
      if (cards) {
        gsap.set(cards, { autoAlpha: 0, y: 48 });
        tl.to(
          cards,
          {
            autoAlpha: 1,
            y: 0,
            delay: 0.3,
            duration: 0.6,
            ease: 'power4.out',
            stagger: 0.3,
          },
          '>-0.1',
        );
      }

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
  return (
    <section
      id='testimonials'
      ref={sectionRef}
      className='overflow-hidden bg-black px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-20'
    >
      <div className='mx-auto mb-12 max-w-6xl'>
        <div className='my-4 flex items-center gap-4'>
          <div ref={eyebrowRef} className='h-px w-8 bg-[#00d4ff]' />
          <GsapTextAnimation
            animateOnScroll={false} // irrelevant now — timeline prop takes over
            delay={0}
            timeline={tlRef.current}
            position='<' // starts alongside the eyebrow line
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              WHAT PLAYERS SAY
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
              Testimonials
            </span>
          </h1>
        </GsapTextAnimation>
        <GsapTextAnimation
          animateOnScroll={false}
          delay={0}
          timeline={tlRef.current}
          position='-=0.4' // starts slightly before the previous item finishes
        >
          <p className='text-left text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]'>
            Real feedback from real customers.
          </p>
        </GsapTextAnimation>
      </div>
      <div
        ref={marqueeRef}
        className='relative flex w-full flex-col items-center justify-center overflow-hidden'
      >
        {/* ref={cardsRef} */}
        <Marquee ref={cardsRef} pauseOnHover className='[--duration:22s]'>
          {firstRow.map((review, index) => (
            <Link
              className='flex w-[clamp(260px,80vw,320px)] shrink-0'
              key={index}
              href='https://biturl.in/Home/Index/54F66B24'
              target='_blank'
              rel='noopener noreferrer'
            >
              <NeonGlowCornerCutCard
                type='marquee'
                colorA='cyan'
                reviewerName={review.name}
                reviewerInitial={review.name.at(0)}
                reviewRating={review.rating}
                reviewText={review.text}
                hoverEffect='pulse'
                glowIntensity='medium'
              />
            </Link>
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className='[--duration:22s]'>
          {secondRow.map((review, index) => (
            <Link
              className='flex w-[clamp(260px,80vw,320px)] shrink-0'
              key={index}
              href='https://biturl.in/Home/Index/54F66B24'
              target='_blank'
              rel='noopener noreferrer'
            >
              <NeonGlowCornerCutCard
                type='marquee'
                colorA='cyan'
                reviewerName={review.name}
                reviewerInitial={review.name.at(0)}
                reviewRating={review.rating}
                reviewText={review.text}
                hoverEffect='pulse'
                glowIntensity='low'
              />
            </Link>
          ))}
        </Marquee>
        <div className='pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-black to-transparent' />
        <div className='pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-black to-transparent' />
        {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-linear-to-l from-background"></div> */}
      </div>
    </section>
  );
}
