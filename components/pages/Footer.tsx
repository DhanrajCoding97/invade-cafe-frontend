'use client';
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { InstagramIcon, WhatsappIcon } from '../svgs';
import Link from 'next/link';
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Games', href: '#games' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Booking', href: '#booking' },
  { label: 'Contact', href: '#contact' },
];

export function Footer() {
  return (
    <footer className='relative border-t border-cyan-950 overflow-hidden text-foreground'>
      <div className='relative mx-auto max-w-6xl px-6 py-14'>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent text-2xl font-bold tracking-wide'>
              Invade
            </span>
            <p className='mt-3 max-w-xs text-sm leading-relaxed text-[#bcbcbc]'>
              Laid-back gaming hangout in Navi Mumbai — PC and PlayStation,
              racing sims and VR.
            </p>
            <div className='mt-5 flex gap-3'>
              <Link
                href='https://instagram.com/invadegamingcafe'
                target='_blank'
                rel='noreferrer noopener'
                aria-label='Invade Gaming Cafe on Instagram'
                className='rounded-md border border-neon-magenta/30 p-2 text-neon-magenta transition-shadow hover:shadow-[0_0_16px_var(--neon-magenta)]'
              >
                <InstagramIcon className='h-4 w-4' />
              </Link>
              <Link
                href='https://wa.me/918291158779'
                target='_blank'
                rel='noreferrer noopener'
                aria-label='WhatsApp Invade Gaming Cafe'
                className='rounded-md border border-neon-grid/30 p-2 text-neon-grid transition-shadow hover:shadow-[0_0_16px_var(--neon-grid)]'
              >
                <WhatsappIcon className='h-4 w-4' />
              </Link>
            </div>
          </div>

          {/* Explore */}
          <nav aria-label='Footer navigation'>
            <h2 className='text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan'>
              Explore
            </h2>
            <ul className='mt-4 grid grid-cols-2 gap-y-2 text-sm lg:grid-cols-1'>
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className='text-[#bcbcbc] transition-colors hover:text-neon-cyan'
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Get in touch */}
          <div>
            <h2 className='text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan'>
              Get in touch
            </h2>
            <ul className='mt-4 space-y-3 text-sm text-[#bcbcbc]'>
              <li>
                <Link
                  href='tel:+918291158779'
                  className='flex items-center gap-2 transition-colors hover:text-neon-cyan'
                >
                  <Phone className='h-4 w-4 shrink-0 text-[#28F1FF]' />
                  +91 82911 58779
                </Link>
              </li>
              <li>
                <Link
                  href='mailto:hello@invadecafe.com'
                  className='flex items-center gap-2 transition-colors hover:text-neon-cyan'
                >
                  <Mail className='h-4 w-4 shrink-0 text-[#28F1FF]' />
                  hello@invadecafe.com
                </Link>
              </li>
              <li className='flex gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-[#28F1FF]' />
                <span className='leading-relaxed'>
                  Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06,
                  opposite Juinagar Railway Station, Sector 11, Sanpada, Navi
                  Mumbai, Maharashtra 400705
                </span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h2 className='text-xs font-semibold uppercase tracking-[0.2em] text-neon-cyan'>
              Hours
            </h2>
            <div className='mt-4 space-y-2 text-sm text-[#bcbcbc]'>
              <p className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-neon-grid shadow-[0_0_10px_var(--neon-grid)]' />
                Open daily
              </p>
              <p className='flex items-center gap-2'>
                <Clock className='h-4 w-4 shrink-0 text-[28F1FF]' />
                10:00 AM — 11:00 PM
              </p>
              <p className='pt-2 text-xs leading-relaxed'>
                Walk in anytime, or book ahead on busy weekends.
              </p>
            </div>
          </div>
        </div>

        <div className='mt-12 flex flex-col gap-3 border-t border-neon-cyan/15 pt-6 text-xs text-[#bcbcbc] sm:flex-row sm:items-center sm:justify-between'>
          <p>
            © {new Date().getFullYear()} Invade Gaming Cafe. All rights
            reserved.
          </p>
          <div className='flex items-center gap-3'>
            <Link
              href='/privacy'
              className='transition-colors hover:text-neon-cyan'
            >
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link
              href='/terms-and-conditions'
              className='transition-colors hover:text-neon-cyan'
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
