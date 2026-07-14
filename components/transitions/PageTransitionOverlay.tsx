// // components/PageTransitionOverlay.tsx
// 'use client';
// import { useEffect, useRef } from 'react';
// import { registerBlocks, revealTransition } from '@/lib/PageTransition';

// export default function PageTransitionOverlay() {
//   const containerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (containerRef.current) {
//       registerBlocks(containerRef.current);
//       revealTransition(); // one-time reveal on first paint
//     }
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className='pointer-events-none fixed top-0 left-0 z-50 flex h-screen w-screen flex-col'
//     >
//       <div className='flex flex-1'>
//         <div className='block invisible flex-1 origin-top scale-y-100 bg-white will-change-transform' />
//         <div className='block invisible flex-1 origin-top scale-y-100 bg-white will-change-transform' />
//         <div className='block invisible flex-1 origin-top scale-y-100 bg-white will-change-transform' />
//         <div className='block invisible flex-1 origin-top scale-y-100 bg-white will-change-transform' />
//       </div>
//       <div className='flex flex-1'>
//         <div className='block invisible flex-1 origin-bottom scale-y-100 bg-white will-change-transform' />
//         <div className='block invisible flex-1 origin-bottom scale-y-100 bg-white will-change-transform' />
//         <div className='block invisible flex-1 origin-bottom scale-y-100 bg-white will-change-transform' />
//         <div className='block invisible flex-1 origin-bottom scale-y-100 bg-white will-change-transform' />
//       </div>
//     </div>
//   );
// }

// components/PageTransitionOverlay.tsx
'use client';
import { useEffect, useRef } from 'react';
import { registerBlocks, revealTransition } from '@/lib/PageTransition';

export default function PageTransitionOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      registerBlocks(containerRef.current);
      revealTransition();
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className='pointer-events-none fixed top-0 left-0 z-50 flex h-screen w-screen flex-col'
    >
      <div className='flex flex-1'>
        <div
          className='block flex-1 origin-top bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
        <div
          className='block flex-1 origin-top bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
        <div
          className='block flex-1 origin-top bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
        <div
          className='block flex-1 origin-top bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
      </div>
      <div className='flex flex-1'>
        <div
          className='block flex-1 origin-bottom bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
        <div
          className='block flex-1 origin-bottom bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
        <div
          className='block flex-1 origin-bottom bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
        <div
          className='block flex-1 origin-bottom bg-black will-change-transform'
          style={{ visibility: 'visible', transform: 'scaleY(1)' }}
        />
      </div>
    </div>
  );
}
