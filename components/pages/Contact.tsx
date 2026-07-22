'use client';
import React from 'react';
import { WhatsappIcon, PhoneIcon, MailIcon, InstagramIcon } from '../svgs';
import { ContactLink } from '../ContactLink';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import GsapTextAnimation from '../GsapTextAnimation';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

function InfoCard({
  label,
  children,
  onLabelLinesReady,
}: {
  label: string;
  children: React.ReactNode;
  onLabelLinesReady?: (lines: HTMLElement[]) => void;
}) {
  return (
    <div className='space-y-2 rounded-xl border border-white/10 bg-[#0a0a0a] p-5 transition-colors hover:border-[#00d4ff]/30'>
      <GsapTextAnimation mode='controlled' onLinesReady={onLabelLinesReady}>
        <p className='text-[12px] tracking-wide text-[#00D4FF] uppercase sm:text-base'>
          {label}
        </p>
      </GsapTextAnimation>
      {children}
    </div>
  );
}

function HoursRow({
  day,
  time,
  onReveal,
}: {
  day: string;
  time: string;
  onReveal?: (lines: HTMLElement[]) => void;
}) {
  const dayLinesRef = useRef<HTMLElement[] | null>(null);
  const timeLinesRef = useRef<HTMLElement[] | null>(null);
  const reportedRef = useRef(false);

  function maybeReport() {
    if (reportedRef.current || !dayLinesRef.current || !timeLinesRef.current)
      return;
    reportedRef.current = true;
    onReveal?.([...dayLinesRef.current, ...timeLinesRef.current]);
  }

  return (
    <div className='flex items-center justify-between py-1.5 text-sm'>
      <GsapTextAnimation
        mode='controlled'
        onLinesReady={(lines) => {
          dayLinesRef.current = lines;
          maybeReport();
        }}
      >
        <span className='text-[#bbb]'>{day}</span>
      </GsapTextAnimation>
      <GsapTextAnimation
        mode='controlled'
        onLinesReady={(lines) => {
          timeLinesRef.current = lines;
          maybeReport();
        }}
      >
        <span className='font-medium text-white'>{time}</span>
      </GsapTextAnimation>
    </div>
  );
}

type RevealItem = { icon?: HTMLElement; lines?: HTMLElement[] };

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowLineRef = useRef<HTMLDivElement>(null);
  const contactCardsRef = useRef<HTMLDivElement>(null);
  const mapsRef = useRef<HTMLDivElement>(null);
  const cardLabelLinesRef = useRef<(HTMLElement[] | undefined)[]>([]);
  const cardItemsRef = useRef<RevealItem[][]>([[], [], []]); // one array per card

  const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));
  // gsap scrollTrigger animation
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
            mapsRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power4.inOut' },
            '-=0.5',
          );

        const cards = contactCardsRef.current?.children;
        if (cards) {
          gsap.set(cards, { autoAlpha: 0, y: 48 });

          const CARD_STAGGER = 0.3;
          const ITEM_STAGGER = 0.12;

          tl.addLabel('cardsStart', '-=0.1').to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: 'power4.out',
              stagger: CARD_STAGGER,
            },
            'cardsStart',
          );

          cardLabelLinesRef.current.forEach((cardLines, cardIdx) => {
            if (!cardLines?.length) return;
            const cardLabel = `card${cardIdx}Start`;

            tl.addLabel(
              cardLabel,
              `cardsStart+=${cardIdx * CARD_STAGGER + 0.1}`,
            ).to(
              cardLines,
              { y: '0%', duration: 0.6, stagger: 0.08, ease: 'power4.out' },
              cardLabel,
            );

            (cardItemsRef.current[cardIdx] ?? []).forEach((item, itemIdx) => {
              if (!item) return;
              const pos = `${cardLabel}+=${0.2 + itemIdx * ITEM_STAGGER}`;

              if (item.icon) {
                tl.to(
                  item.icon,
                  {
                    autoAlpha: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.5,
                    ease: 'power4.out',
                  },
                  pos,
                );
              }
              if (item.lines?.length) {
                tl.to(
                  item.lines,
                  { y: '0%', duration: 0.6, stagger: 0.06, ease: 'power4.out' },
                  pos,
                );
              }
            });
          });
        }

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
      id='contact'
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
              FIND US
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
              Visit Invade
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
            Our location, hours, and the easiest ways to reach us.
          </p>
        </GsapTextAnimation>
        {/* Two-column body */}
        <div className='mt-8 md:mt-10 lg:mt-12 grid grid-cols-1 gap-6 md:grid-cols-[0.9fr_1.1fr]'>
          {/* Info column */}
          <div
            ref={contactCardsRef}
            className='order-2 flex flex-col gap-4 md:order-1'
          >
            {/* social links card */}
            <InfoCard
              label='Get in touch'
              onLabelLinesReady={(lines) => {
                cardLabelLinesRef.current[0] = lines;
              }}
            >
              <div className='flex flex-col gap-2.5'>
                <ContactLink
                  icon={<WhatsappIcon height={16} width={16} />}
                  href='https://wa.me/918291158779'
                  accent='#25D366'
                  onReveal={(data) => {
                    cardItemsRef.current[0][0] = data;
                  }}
                >
                  <span>WhatsApp us</span>
                </ContactLink>
                <ContactLink
                  icon={<InstagramIcon height={16} width={16} />}
                  href='https://instagram.com/invadegamingcafe'
                  accent='#E1306C'
                  onReveal={(data) => {
                    cardItemsRef.current[0][1] = data;
                  }}
                >
                  @invadegamingcafe
                </ContactLink>
                <ContactLink
                  icon={<PhoneIcon height={16} width={16} />}
                  href='tel:+918291158779'
                  accent='#00d4ff'
                  onReveal={(data) => {
                    cardItemsRef.current[0][2] = data;
                  }}
                >
                  +91 82911 58779
                </ContactLink>
                <ContactLink
                  icon={<MailIcon height={16} width={16} />}
                  href='mailto:hello@invadecafe.com'
                  accent='#FDD267'
                  onReveal={(data) => {
                    cardItemsRef.current[0][3] = data;
                  }}
                >
                  hello@invadecafe.com
                </ContactLink>
              </div>
            </InfoCard>
            {/* address */}
            <InfoCard
              label='Address'
              onLabelLinesReady={(lines) => {
                cardLabelLinesRef.current[1] = lines;
              }}
            >
              <GsapTextAnimation
                mode='controlled'
                onLinesReady={(lines) => {
                  cardItemsRef.current[1][0] = { lines };
                }}
              >
                <p className='text-[11px] sm:text-sm text-[#bcbcbc]'>
                  Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06,
                  opposite Juinagar Railway Station, Sector 11,
                  <br />
                  Sanpada, Navi Mumbai, Maharashtra 400705
                </p>
              </GsapTextAnimation>
            </InfoCard>
            {/* hours card */}
            <InfoCard
              label='Hours'
              onLabelLinesReady={(lines) => {
                cardLabelLinesRef.current[2] = lines;
              }}
            >
              <HoursRow
                day='Mon – Sun'
                time='10 AM – 11 PM'
                onReveal={(lines) => {
                  cardItemsRef.current[2][0] = { lines };
                }}
              />
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
