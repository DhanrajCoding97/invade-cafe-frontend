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
