'use client';
import React from 'react';
import { WhatsappIcon, PhoneIcon, MailIcon, InstagramIcon } from '../svgs';
import { ContactLink } from '../ContactLink';
import { useRef } from 'react';
import LineReveal from '../gsap/LineReveal';
import TextReveal from '../gsap/TextReveal';
import CardsReveal from '../gsap/CardReveal';

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

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id='contact'
      ref={sectionRef}
      className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py:16 lg:py-20 bg-black'
    >
      <div className='mx-auto max-w-6xl'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          {/* <LineReveal triggerRef={sectionRef} delay={0}>
          </LineReveal> */}
          <div className='h-px w-8 bg-[#00d4ff]' />
          {/* <TextReveal triggerRef={sectionRef} delay={0.15}>
          </TextReveal> */}
          <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
            FIND US
          </span>
        </div>
        {/* main title */}
        {/* <TextReveal triggerRef={sectionRef} delay={0.25}>
        </TextReveal> */}
        <h2 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Visit Invade
          </span>
        </h2>
        {/* description */}
        {/* <TextReveal triggerRef={sectionRef} delay={0.55}>
        </TextReveal> */}
        <p className='py-2 max-w-[80ch] text-left text-[clamp(0.78rem,2.2vw,1.125rem)] leading-[1.65] text-[#bcbcbc]'>
          Invade Gaming Cafe is located on the ground floor of Bhakti Residency,
          Shop-08/A, Plot Number-06, opposite Juinagar Railway Station in Sector
          11, Sanpada, Navi Mumbai. We're open daily from 10 AM to 11 PM — drop
          in anytime or check below for directions and contact details.
        </p>
        {/* Two-column body */}
        <div className='mt-8 md:mt-10 lg:mt-12 grid grid-cols-1 gap-6 md:grid-cols-[0.9fr_1.1fr]'>
          {/* Info column */}
          {/* <CardsReveal triggerRef={sectionRef} delay={1.05} stagger={0.4}>
          </CardsReveal> */}
          <div className='order-2 flex flex-col gap-4 md:order-1 z-1'>
            {/* social links card */}
            <InfoCard label='Get in touch'>
              <div className='flex flex-col gap-2.5'>
                <ContactLink
                  icon={<WhatsappIcon height={16} width={16} />}
                  href='https://wa.me/918291158779'
                  accent='#25D366'
                >
                  <span>WhatsApp us</span>
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
              <div className='flex items-center justify-between py-1.5 text-sm'>
                <span className='text-[#bbb]'>Mon – Sun</span>
                <span className='font-medium text-white'>10 AM – 11 PM</span>
              </div>
            </InfoCard>
          </div>
          {/* Map */}
          {/* <LineReveal triggerRef={sectionRef} delay={0.75} duration={0.4}>
          </LineReveal> */}
          <div className='group relative order-1 min-h-85 overflow-hidden rounded-2xl border border-white/10 transition-colors hover:border-[#00d4ff]/40 md:order-2'>
            <div className='pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-[#00d4ff]/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100' />
            <iframe
              title='InVade Gaming Cafe location on Google Maps'
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
