'use client';

import Link from 'next/link';
import { WhatsappIcon, PhoneIcon, MailIcon, InstagramIcon } from './svgs';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from './GsapTextAnimation';

gsap.registerPlugin(ScrollTrigger);

function InfoCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className='space-y-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 transition-colors hover:border-[#00d4ff]/30'>
      <p className='text-[12px] tracking-wide text-[#00D4FF] uppercase sm:text-base'>
        {label}
      </p>
      {children}
    </div>
  );
}

export function ContactLink({
  icon,
  href,
  children,
  accent = '#00d4ff',
}: {
  icon: React.ReactNode;
  href: string;
  children: React.ReactNode;
  accent?: string;
}) {
  return (
    <Link
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='group flex items-center gap-3 text-xs sm:text-sm text-[#bcbcbc] transition-colors hover:text-[#00D4FF]'
    >
      <span
        className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform group-hover:scale-110'
        style={{ background: `${accent}1a`, color: accent }}
      >
        {icon}
      </span>
      {children}
    </Link>
  );
}

function HoursRow({
  day,
  time,
  last = false,
}: {
  day: string;
  time: string;
  last?: boolean;
}) {
  return (
    <div className='flex items-center justify-between py-1.5 text-sm'>
      <span className='text-[#bbb]'>{day}</span>
      <span className='font-medium text-white'>{time}</span>
    </div>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const contactCardsRef = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  // gsap scrollTrigger animation
  useGSAP(
    // () => {
    //   gsap.from([eyebrowRef.current], {
    //     opacity: 0,
    //     ...REVEAL.header,
    //     // y: 30,
    //     // duration: 0.8,
    //     // ease: "power2.out",
    //     // stagger: 0.45,
    //     scrollTrigger: {
    //       trigger: sectionRef.current,
    //       start: 'top 75%',
    //       toggleActions: 'play none none none',
    //     },
    //   });

    //   const cards = contactCardsRef.current?.children;
    //   if (cards) {
    //     gsap.from(cards, {
    //       opacity: 0,
    //       y: 50,
    //       duration: 0.6,
    //       delay: 0.4,
    //       ease: 'sine.inOut',
    //       stagger: 0.3,
    //       scrollTrigger: {
    //         trigger: contactCardsRef.current,
    //         start: 'top 80%',
    //         toggleActions: 'play none none none',
    //       },
    //     });
    //   }
    () => {
      if (!sectionRef.current) return;
      const tl = tlRef.current;

      // Non-text pieces get added directly, positioned relative to each other
      tl.fromTo(
        eyebrowRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
        0, // starts at t=0 of the sequence
      ).fromTo(
        mapsRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power4.inOut' },
      );

      const cards = contactCardsRef.current?.children;
      if (cards) {
        gsap.set(cards, { autoAlpha: 0, y: 48 });
        tl.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: 'power4.inOut',
          stagger: 0.2,
        });
      }

      // gsap.from(mapsRef.current, {
      //   opacity: 0,
      //   y: 50,
      //   duration: 0.8,
      //   delay: 0.8,
      //   ease: 'power4.inOut',
      //   scrollTrigger: {
      //     trigger: mapsRef.current,
      //     start: 'top 80%',
      //     toggleActions: 'play none none none',
      //   },
      // });
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
      id='contact'
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
              FIND US
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
              Visit Invade
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
            Our location, hours, and the easiest ways to reach us.
          </p>
        </GsapTextAnimation>
        {/* Two-column body */}
        <div className='mt-12 grid grid-cols-1 gap-6 md:grid-cols-[0.9fr_1.1fr]'>
          {/* Info column */}
          <div
            ref={contactCardsRef}
            className='order-2 flex flex-col gap-4 md:order-1'
          >
            {/* social links card */}
            <InfoCard label='Get in touch'>
              <div className='flex flex-col gap-2.5'>
                <ContactLink
                  icon={<WhatsappIcon height={16} width={16} />}
                  href='https://wa.me/918291158779'
                  accent='#25D366'
                >
                  WhatsApp us
                </ContactLink>
                <ContactLink
                  icon={<InstagramIcon height={16} width={16} />}
                  href='https://instagram.com/invadegamingcafe'
                  accent='#E1306C'
                >
                  @invadegamingcafe
                </ContactLink>
                <ContactLink
                  icon={<PhoneIcon height={16} width={16} />}
                  href='tel:+918291158779'
                  accent='#00d4ff'
                >
                  +91 82911 58779
                </ContactLink>
                <ContactLink
                  icon={<MailIcon height={16} width={16} />}
                  href='mailto:hello@invadecafe.com'
                  accent='#FDD267'
                >
                  hello@invadecafe.com
                </ContactLink>
              </div>
            </InfoCard>
            {/* address */}
            <InfoCard label='Address'>
              <p className='text-[11px] sm:text-sm text-[#bcbcbc]'>
                Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06,
                opposite Juinagar Railway Station, Sector 11,
                <br />
                Sanpada, Navi Mumbai, Maharashtra 400705
              </p>
            </InfoCard>
            {/* hours card */}
            <InfoCard label='Hours'>
              <HoursRow day='Mon – Sun' time='10 AM – 11 PM' />
            </InfoCard>
          </div>
          {/* Map */}
          <div
            ref={mapsRef}
            className='group relative order-1 min-h-85 overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-[#00d4ff]/40 md:order-2'
          >
            <div className='pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-[#00d4ff]/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100' />{' '}
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3643.5212078436365!2d73.01288567520483!3d19.05530278214504!2m3!1f0!2f0!3f0!3m2!1i1020!2i768!4f13.1!3m3!1m2!1s0x3be7c17d6e4b5365%3A0x3ef9695a4157527c!2sINVADE%20GAMING%20CAFE!5e1!3m2!1sen!2sin!4v1783675916752!5m2!1sen!2sin'
              width='100%'
              height='100%'
              style={{ border: 0, minHeight: 340 }}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
            />
          </div>
        </div>
      </div>
    </section>
  );
}
