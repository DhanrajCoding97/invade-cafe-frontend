import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function GallerySkeleton() {
  return (
    <div className='space-y-8 bg-transparent'>
      {/* Eyebrow label */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-px w-8 bg-white/10' />
        <Skeleton className='h-3 w-28 bg-white/10' />
      </div>

      {/* Heading */}
      <Skeleton className='h-10 w-40 rounded-md bg-white/10 sm:h-12 sm:w-56' />

      {/* Description */}
      <div className='space-y-2'>
        <Skeleton className='h-4 w-full max-w-xl bg-white/10' />
        <Skeleton className='h-4 w-2/3 max-w-md bg-white/10' />
      </div>

      {/* Carousel */}
      <div className='relative flex items-center justify-center gap-3 sm:gap-4'>
        {/* Prev arrow (hidden on small screens) */}
        <Skeleton className='hidden h-10 w-10 shrink-0 rounded-full bg-white/10 sm:flex' />

        {/* Side peek — left */}
        <Skeleton className='hidden aspect-3/4 w-1/6 shrink-0 rounded-2xl bg-white/10 md:block' />

        {/* Main slide */}
        <Skeleton className='aspect-4/5 w-full max-w-xl shrink-0 rounded-2xl bg-white/10 sm:aspect-video md:aspect-4/5' />

        {/* Side peek — right */}
        <Skeleton className='hidden aspect-3/4 w-1/6 shrink-0 rounded-2xl bg-white/10 md:block' />

        {/* Next arrow (hidden on small screens) */}
        <Skeleton className='hidden h-10 w-10 shrink-0 rounded-full bg-white/10 sm:flex' />
      </div>

      {/* Mobile arrows (shown only below sm) */}
      <div className='flex items-center justify-center gap-4 sm:hidden'>
        <Skeleton className='h-9 w-9 rounded-full bg-white/10' />
        <Skeleton className='h-9 w-9 rounded-full bg-white/10' />
      </div>

      {/* Dot pagination */}
      <div className='flex items-center justify-center gap-2'>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className={`h-2 rounded-full bg-white/10 ${i === 0 ? 'w-6' : 'w-2'}`}
          />
        ))}
      </div>
    </div>
  );
}