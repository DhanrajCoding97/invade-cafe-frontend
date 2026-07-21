'use client';
import { Review } from '@/types';
import { Marquee } from '../ui/marquee';
import NeonGlowCornerCutCard from '@/app/components/neonblade-ui/neon-glow-corner-cut-card';
import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from '../GsapTextAnimation';

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

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowLineRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLParagraphElement>(null);
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
            marqueeRef.current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.4, ease: 'power4.inOut' },
            '+=0.085',
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
  return (
    <section
      id='testimonials'
      ref={sectionRef}
      className='overflow-hidden px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py:16 lg:py-20 bg-black'
    >
      <div className='mx-auto mt-6 sm:mt-8 md:mt-10 lg:mt-12 max-w-6xl'>
        <div className='my-4 flex items-center gap-4'>
          <div ref={eyebrowLineRef} className='h-px w-8 bg-[#00d4ff]' />
          <GsapTextAnimation
            mode='controlled'
            onLinesReady={(lines) => {
              linesRef.current.eyebrowText = lines;
            }}
          >
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              WHAT PLAYERS SAY
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
              Testimonials
            </span>
          </h1>
        </GsapTextAnimation>
        <GsapTextAnimation
          mode='controlled'
          onLinesReady={(lines) => {
            linesRef.current.desc = lines;
          }}
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
        <Marquee pauseOnHover className='[--duration:22s]'>
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
