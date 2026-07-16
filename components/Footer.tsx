'use client';
import { playSectionTransition } from '@/lib/PageTransition';
import { Separator } from './ui/separator';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { getLenisInstance } from '@/lib/lenisInstance';
import { ContactLink } from './Contact';
import { WhatsappIcon, PhoneIcon, MailIcon, InstagramIcon } from './svgs';
import Link from 'next/link';
const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#contact' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
];

function scrollToSection(href: string) {
  playSectionTransition(() => {
    getLenisInstance().scrollTo(href);
  });
}

export default function Footer() {
  return (
    <section className='bg-black px-4 pt-8 pb-4 sm:px-6 sm:pt-12 g:px-8 lg:pt-20 flex flex-col gap-4'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6'>
        {/* footer heading */}
        <div className='flex flex-col gap-3 sm:col-span-2 lg:col-span-4'>
          <div className='inline-flex flex-col items-center select-none'>
            <h1
              className='
                        text-5xl
                        md:text-7xl
                        font-black
                        uppercase
                        tracking-wider
                        leading-none
                        bg-gradient-to-r
                        from-cyan-400
                        via-indigo-300
                        to-fuchsia-500
                        bg-clip-text
                        text-transparent
                        '
            >
              INVADE
            </h1>

            <div className='mt-2 flex items-center gap-4'>
              <div className='h-px w-10 bg-gradient-to-r from-transparent to-cyan-400' />

              <span
                className='
                            text-sm
                            md:text-base
                            uppercase
                            tracking-[0.45em]
                            text-cyan-400
                            font-medium
                        '
              >
                Gaming Cafe
              </span>

              <div className='h-px w-10 bg-gradient-to-l from-transparent to-fuchsia-500' />
            </div>
          </div>
          <CornerCutButton
            onClick={() =>
              playSectionTransition(() => {
                getLenisInstance().scrollTo('#booking', {
                  offset: 40,
                });
              })
            }
            color='cyan'
            variant='solid'
            showArrow
            hoverEffect='shift'
            fullWidthOnMobile={true}
          >
            PLay now
          </CornerCutButton>
        </div>
        {/* footer nav links */}
        {/* Nav links */}
        <div className='flex flex-col gap-3 lg:col-span-2'>
          <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
            Explore
          </h3>
          {navLinks.map(({ label, href }) => (
            <button
              key={label}
              onClick={() => scrollToSection(href)}
              className='text-left text-sm text-neutral-300 hover:text-cyan-400 transition-colors w-fit'
            >
              {label}
            </button>
          ))}
        </div>
        {/* Contact / spare column */}
        <div className='flex flex-col gap-3 lg:col-span-3'>
          <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
            Get In Touch
          </h3>
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
        </div>
        <div className='flex flex-col gap-3 lg:col-span-3'>
          <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
            Visit us
          </h3>
          <p className='text-[11px] sm:text-sm text-[#bcbcbc]'>
            Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06, opposite
            Juinagar Railway Station, Sector 11,
            <br />
            Sanpada, Navi Mumbai, Maharashtra 400705
          </p>
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
          <p className='text-sm text-neutral-400'>
            Mon – Sun &nbsp;|&nbsp; 10:00 AM – 11:00 PM
          </p>
        </div>
      </div>
      <Separator />
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500'>
        <p className='flex items-center gap-1 footer-subtext'>
          © {new Date().getFullYear()} Invade Gaming Cafe.
          <span> All rights reserved. </span>
        </p>
        <div className='flex items-center gap-4'>
          {legalLinks.map(({ label, href }, i) => (
            <span key={label} className='flex items-center gap-4'>
              <Link
                href={href}
                className='hover:text-cyan-400 transition-colors'
              >
                {label}
              </Link>
              {i < legalLinks.length - 1 && (
                <span className='text-neutral-700'>|</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
