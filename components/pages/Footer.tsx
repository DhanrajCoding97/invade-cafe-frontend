// 'use client';
// import { playSectionTransition } from '@/lib/PageTransition';
// import { Separator } from './ui/separator';
// import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
// import { getLenisInstance } from '@/lib/lenisInstance';
// import { ContactLink } from './ContactLink';
// import { WhatsappIcon, PhoneIcon, MailIcon, InstagramIcon } from './svgs';
// import GsapTextAnimation from './GsapTextAnimation';
// import gsap from 'gsap';
// import { useRef } from 'react';
// import { useGSAP } from '@gsap/react';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';

// gsap.registerPlugin(ScrollTrigger);
// import Link from 'next/link';
// const navLinks = [
//   { label: 'Home', href: '#hero' },
//   { label: 'Services', href: '#services' },
//   { label: 'Pricing', href: '#pricing' },
//   { label: 'Gallery', href: '#gallery' },
//   { label: 'Reviews', href: '#reviews' },
//   { label: 'Contact', href: '#contact' },
// ];

// const legalLinks = [
//   { label: 'Privacy Policy', href: '/privacy-policy' },
//   { label: 'Terms & Conditions', href: '/terms' },
// ];

// function scrollToSection(href: string) {
//   getLenisInstance().scrollTo(href);
// }

// // export default function Footer() {
// //   const footerRef = useRef<HTMLDivElement>(null);
// //   const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

// //   useGSAP(
// //     () => {
// //       if (!footerRef.current) return;
// //       const tl = tlRef.current;

// //       ScrollTrigger.create({
// //         trigger: footerRef.current,
// //         start: 'top 70%',
// //         once: true,
// //         onEnter: () => tl.play(),
// //       });
// //     },
// //     { scope: footerRef },
// //   );
// //   return (
// //     <section
// //       ref={footerRef}
// //       className='bg-black px-4 pt-8 pb-4 sm:px-6 sm:pt-12 g:px-8 lg:pt-20 flex flex-col gap-4'
// //     >
// //       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6'>
// //         {/* footer heading */}
// //         <div className='flex flex-col gap-3 sm:col-span-2 lg:col-span-4'>
// //           <div className='inline-flex flex-col items-center select-none'>
// //             <h1
// //               className='
// //                         text-5xl
// //                         md:text-7xl
// //                         font-black
// //                         uppercase
// //                         tracking-wider
// //                         leading-none
// //                         bg-gradient-to-r
// //                         from-cyan-400
// //                         via-indigo-300
// //                         to-fuchsia-500
// //                         bg-clip-text
// //                         text-transparent
// //                         '
// //             >
// //               INVADE
// //             </h1>

// //             <div className='mt-2 flex items-center gap-4'>
// //               <div className='h-px w-10 bg-gradient-to-r from-transparent to-cyan-400' />

// //               <span
// //                 className='
// //                             text-sm
// //                             md:text-base
// //                             uppercase
// //                             tracking-[0.45em]
// //                             text-cyan-400
// //                             font-medium
// //                         '
// //               >
// //                 Gaming Cafe
// //               </span>

// //               <div className='h-px w-10 bg-gradient-to-l from-transparent to-fuchsia-500' />
// //             </div>
// //           </div>
// //           <CornerCutButton
// //             onClick={() =>
// //               playSectionTransition(() => {
// //                 getLenisInstance().scrollTo('#booking', {
// //                   offset: 40,
// //                 });
// //               })
// //             }
// //             color='cyan'
// //             variant='solid'
// //             showArrow
// //             hoverEffect='shift'
// //             fullWidthOnMobile={true}
// //           >
// //             PLay now
// //           </CornerCutButton>
// //         </div>
// //         {/* footer nav links */}
// //         {/* Nav links */}
// //         <div className='flex flex-col gap-3 lg:col-span-2'>
// //           <GsapTextAnimation
// //             animateOnScroll={false}
// //             timeline={tlRef.current}
// //             position='<'
// //             delay={0}
// //           >
// //             <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
// //               Explore
// //             </h3>
// //           </GsapTextAnimation>
// //           {navLinks.map(({ label, href }) => (
// //             <GsapTextAnimation
// //               key={label}
// //               timeline={tlRef.current}
// //               position='<+0.1'
// //               animateOnScroll={false}
// //               delay={0}
// //             >
// //               <Link
// //                 href={`/#${label}`}

// //                 onClick={() => scrollToSection(href)}
// //                 className='text-left text-sm text-neutral-300 hover:text-cyan-400 transition-colors w-fit'
// //               >
// //                 {label}
// //               </Link>
// //             </GsapTextAnimation>
// //           ))}
// //         </div>
// //         {/* Contact / spare column */}
// //         <div className='flex flex-col gap-3 lg:col-span-3'>
// //           <GsapTextAnimation
// //             animateOnScroll={false}
// //             delay={0}
// //             timeline={tlRef.current}
// //             position='<+0.05'
// //           >
// //             <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
// //               Get In Touch
// //             </h3>
// //           </GsapTextAnimation>

// //           <ContactLink
// //             icon={<WhatsappIcon height={16} width={16} />}
// //             href='https://wa.me/918291158779'
// //             accent='#25D366'
// //           >
// //             WhatsApp us
// //           </ContactLink>

// //           <ContactLink
// //             icon={<InstagramIcon height={16} width={16} />}
// //             href='https://instagram.com/invadegamingcafe'
// //             accent='#E1306C'
// //           >
// //             @invadegamingcafe
// //           </ContactLink>
// //         </div>
// //         <div className='flex flex-col gap-3 lg:col-span-3'>
// //           <GsapTextAnimation
// //             timeline={tlRef.current}
// //             position='<+0.09'
// //             animateOnScroll={false}
// //             delay={0}
// //           >
// //             <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
// //               Visit us
// //             </h3>
// //           </GsapTextAnimation>
// //           <GsapTextAnimation
// //             timeline={tlRef.current}
// //             position='<+0.1'
// //             animateOnScroll={false}
// //             delay={0}
// //           >
// //             <p className='text-[11px] sm:text-sm text-[#bcbcbc]'>
// //               Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06,
// //               opposite Juinagar Railway Station, Sector 11,
// //               <br />
// //               Sanpada, Navi Mumbai, Maharashtra 400705
// //             </p>
// //           </GsapTextAnimation>

// //           <ContactLink
// //             icon={<PhoneIcon height={16} width={16} />}
// //             href='tel:+918291158779'
// //             accent='#00d4ff'
// //           >
// //             +91 82911 58779
// //           </ContactLink>

// //           <ContactLink
// //             icon={<MailIcon height={16} width={16} />}
// //             href='mailto:hello@invadecafe.com'
// //             accent='#FDD267'
// //           >
// //             hello@invadecafe.com
// //           </ContactLink>

// //           <GsapTextAnimation
// //             timeline={tlRef.current}
// //             position='<+0.1'
// //             animateOnScroll={false}
// //             delay={0}
// //           >
// //             <p className='text-sm text-neutral-400'>
// //               Mon – Sun &nbsp;|&nbsp; 10:00 AM – 11:00 PM
// //             </p>
// //           </GsapTextAnimation>
// //         </div>
// //       </div>
// //       <Separator />
// //       <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500'>
// //         <div className='flex gap-1 items-center footer-subtext'>
// //           <GsapTextAnimation
// //             timeline={tlRef.current}
// //             position='<+0.1'
// //             animateOnScroll={false}
// //             delay={0}
// //           >
// //             <p className='flex items-center gap-1 footer-subtext'>
// //               © {new Date().getFullYear()} Invade Gaming Cafe.
// //             </p>
// //           </GsapTextAnimation>
// //           <GsapTextAnimation
// //             timeline={tlRef.current}
// //             position='<+0.1'
// //             animateOnScroll={false}
// //             delay={0}
// //           >
// //             <span> All rights reserved. </span>
// //           </GsapTextAnimation>
// //         </div>

// //         <div className='flex items-center gap-4'>
// //           {legalLinks.map(({ label, href }, i) => (
// //             <GsapTextAnimation
// //               key={label}
// //               animateOnScroll={false} // irrelevant now — timeline prop takes over
// //               delay={0}
// //               timeline={tlRef.current}
// //             >
// //               <span className='flex items-center gap-4'>
// //                 <Link
// //                   href={href}
// //                   className='hover:text-cyan-400 transition-colors'
// //                 >
// //                   {label}
// //                 </Link>
// //                 {i < legalLinks.length - 1 && (
// //                   <span className='text-neutral-700'>|</span>
// //                 )}
// //               </span>
// //             </GsapTextAnimation>
// //           ))}
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }

// export default function Footer() {
//   const footerRef = useRef<HTMLDivElement>(null);
//   const headingRef = useRef<HTMLDivElement>(null);
//   const playBtnRef = useRef<HTMLDivElement>(null);
//   const tlRef = useRef<gsap.core.Timeline>(gsap.timeline({ paused: true }));

//   useGSAP(
//     () => {
//       if (!footerRef.current) return;
//       const tl = tlRef.current;

//       // single label — every child positions itself relative to this,
//       // instead of chaining off whatever happened to mount before it
//       tl.addLabel('seq', 0);

//       if (headingRef.current) {
//         gsap.set(headingRef.current, { autoAlpha: 0, y: 24 });
//         tl.to(
//           headingRef.current,
//           { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power4.out' },
//           'seq',
//         );
//       }

//       if (playBtnRef.current) {
//         gsap.set(playBtnRef.current, { autoAlpha: 0, y: 24, scale: 0.95 });
//         tl.to(
//           playBtnRef.current,
//           { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: 'power4.out' },
//           'seq+=0.15',
//         );
//       }

//       ScrollTrigger.create({
//         trigger: footerRef.current,
//         start: 'top 80%',
//         once: true,
//         onEnter: () => tl.play(),
//       });

//       // // Layout can shift after SplitText runs on children (line-wrap counts
//       // // differ once webfonts are actually loaded), which can throw off the
//       // // ScrollTrigger start position calculated above. Refresh once fonts
//       // // settle so the trigger point matches real layout.
//       // const refresh = () => ScrollTrigger.refresh();
//       // document.fonts?.ready?.then(refresh);
//       // window.addEventListener('load', refresh);
//       // return () => window.removeEventListener('load', refresh);
//     },
//     { scope: footerRef },
//   );

//   return (
//     <section
//       ref={footerRef}
//       className='bg-black px-4 pt-8 pb-4 sm:px-6 sm:pt-12 g:px-8 lg:pt-20 flex flex-col gap-4'
//     >
//       <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-6'>
//         {/* footer heading */}
//         <div className='flex flex-col gap-3 sm:col-span-2 lg:col-span-4'>
//           <div
//             ref={headingRef}
//             className='invisible inline-flex flex-col items-center select-none'
//           >
//             <h1 className='text-5xl md:text-7xl font-black uppercase tracking-wider leading-none bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-500 bg-clip-text text-transparent'>
//               INVADE
//             </h1>
//             <div className='mt-2 flex items-center gap-4'>
//               <div className='h-px w-10 bg-gradient-to-r from-transparent to-cyan-400' />
//               <span className='text-sm md:text-base uppercase tracking-[0.45em] text-cyan-400 font-medium'>
//                 Gaming Cafe
//               </span>
//               <div className='h-px w-10 bg-gradient-to-l from-transparent to-fuchsia-500' />
//             </div>
//           </div>

//           <div ref={playBtnRef} className='invisible'>
//             <CornerCutButton
//               onClick={() =>
//                 playSectionTransition(() => {
//                   getLenisInstance().scrollTo('#booking', { offset: 40 });
//                 })
//               }
//               color='cyan'
//               variant='solid'
//               showArrow
//               hoverEffect='shift'
//               fullWidthOnMobile={true}
//             >
//               PLay now
//             </CornerCutButton>
//           </div>
//         </div>

//         {/* Explore */}
//         <div className='flex flex-col gap-3 lg:col-span-2'>
//           <GsapTextAnimation>
//             <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
//               Explore
//             </h3>
//           </GsapTextAnimation>
//           {navLinks.map(({ label, href }, i) => (
//             <GsapTextAnimation
//               key={label}
//               // timeline={tlRef.current}
//               // position={`seq+=${0.08 * (i + 1)}`}
//               // animateOnScroll={false}
//               // delay={0}
//             >
//               <Link
//                 href={`/#${label}`}
//                 onClick={() => scrollToSection(href)}
//                 className='text-left text-sm text-neutral-300 hover:text-cyan-400 transition-colors w-fit'
//               >
//                 {label}
//               </Link>
//             </GsapTextAnimation>
//           ))}
//         </div>

//         {/* Get In Touch */}
//         <div className='flex flex-col gap-3 lg:col-span-3'>
//           <GsapTextAnimation>
//             <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
//               Get In Touch
//             </h3>
//           </GsapTextAnimation>

//           <ContactLink
//             icon={<WhatsappIcon height={16} width={16} />}
//             href='https://wa.me/918291158779'
//             accent='#25D366'
//             timeline={tlRef.current}
//             position='seq+=0.15'
//           >
//             WhatsApp us
//           </ContactLink>

//           <ContactLink
//             icon={<InstagramIcon height={16} width={16} />}
//             href='https://instagram.com/invadegamingcafe'
//             accent='#E1306C'
//             timeline={tlRef.current}
//             position='seq+=0.2'
//           >
//             @invadegamingcafe
//           </ContactLink>
//           <ContactLink
//             icon={<PhoneIcon height={16} width={16} />}
//             href='tel:+918291158779'
//             accent='#00d4ff'
//             timeline={tlRef.current}
//             position='seq+=0.25'
//           >
//             +91 82911 58779
//           </ContactLink>

//           <ContactLink
//             icon={<MailIcon height={16} width={16} />}
//             href='mailto:hello@invadecafe.com'
//             accent='#FDD267'
//             timeline={tlRef.current}
//             position='seq+=0.3'
//           >
//             hello@invadecafe.com
//           </ContactLink>
//         </div>

//         {/* Visit Us */}
//         <div className='flex flex-col gap-3 lg:col-span-3'>
//           <GsapTextAnimation>
//             <h3 className='text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-1'>
//               Visit us
//             </h3>
//           </GsapTextAnimation>

//           <GsapTextAnimation>
//             <p className='text-[11px] sm:text-sm text-[#bcbcbc]'>
//               Ground Floor, Bhakti Residency, Shop-08/A, Plot Number-06,
//               opposite Juinagar Railway Station, Sector 11,
//               <br />
//               Sanpada, Navi Mumbai, Maharashtra 400705
//             </p>
//           </GsapTextAnimation>

//           <GsapTextAnimation>
//             <p className='text-sm text-neutral-400'>
//               Mon – Sun &nbsp;|&nbsp; 10:00 AM – 11:00 PM
//             </p>
//           </GsapTextAnimation>
//         </div>
//       </div>

//       <Separator />

//       <div className='flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500'>
//         <GsapTextAnimation>
//           <p className='flex items-center gap-1 footer-subtext'>
//             © {new Date().getFullYear()} Invade Gaming Cafe.
//             <span>All rights reserved.</span>
//           </p>
//         </GsapTextAnimation>

//         <div className='flex items-center gap-4'>
//           {legalLinks.map(({ label, href }, i) => (
//             <GsapTextAnimation key={label}>
//               <span className='flex items-center gap-4'>
//                 <Link
//                   href={href}
//                   className='hover:text-cyan-400 transition-colors'
//                 >
//                   {label}
//                 </Link>
//                 {i < legalLinks.length - 1 && (
//                   <span className='text-neutral-700'>|</span>
//                 )}
//               </span>
//             </GsapTextAnimation>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }
import { MessageCircle, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { InstagramIcon } from '../svgs';
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
    <footer className='relative overflow-hidden border-t border-neon-cyan/20 bg-surface text-foreground'>
      <div
        aria-hidden
        className='pointer-events-none absolute inset-0 opacity-[0.07]'
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--neon-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--neon-grid) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />

      <div className='relative mx-auto max-w-6xl px-6 py-14'>
        <div className='grid gap-10 md:grid-cols-2 lg:grid-cols-4'>
          {/* Brand */}
          <div>
            <span className='bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-magenta bg-clip-text text-2xl font-bold tracking-wide text-transparent'>
              Invade
            </span>
            <p className='mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground'>
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
                className='rounded-md border border-neon-cyan/30 p-2 text-neon-cyan transition-shadow hover:shadow-[0_0_16px_var(--neon-cyan)]'
              >
                <MessageCircle className='h-4 w-4' />
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
                    className='text-muted-foreground transition-colors hover:text-neon-cyan'
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
            <ul className='mt-4 space-y-3 text-sm text-muted-foreground'>
              <li>
                <Link
                  href='tel:+918291158779'
                  className='flex items-center gap-2 transition-colors hover:text-neon-cyan'
                >
                  <Phone className='h-4 w-4 shrink-0 text-neon-magenta' />
                  +91 82911 58779
                </Link>
              </li>
              <li>
                <Link
                  href='mailto:hello@invadecafe.com'
                  className='flex items-center gap-2 transition-colors hover:text-neon-cyan'
                >
                  <Mail className='h-4 w-4 shrink-0 text-neon-magenta' />
                  hello@invadecafe.com
                </Link>
              </li>
              <li className='flex gap-2'>
                <MapPin className='mt-0.5 h-4 w-4 shrink-0 text-neon-magenta' />
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
            <div className='mt-4 space-y-2 text-sm text-muted-foreground'>
              <p className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-neon-grid shadow-[0_0_10px_var(--neon-grid)]' />
                Open daily
              </p>
              <p className='flex items-center gap-2'>
                <Clock className='h-4 w-4 shrink-0 text-neon-magenta' />
                10:00 AM — 11:00 PM
              </p>
              <p className='pt-2 text-xs leading-relaxed'>
                Walk in anytime, or book ahead on busy weekends.
              </p>
            </div>
          </div>
        </div>

        <div className='mt-12 flex flex-col gap-3 border-t border-neon-cyan/15 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between'>
          <p>
            © {new Date().getFullYear()} Invade Gaming Cafe. All rights
            reserved.
          </p>
          <div className='flex items-center gap-3'>
            <Link
              href='#privacy'
              className='transition-colors hover:text-neon-cyan'
            >
              Privacy
            </Link>
            <span aria-hidden>·</span>
            <Link
              href='#terms'
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
