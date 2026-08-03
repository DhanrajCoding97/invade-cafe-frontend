import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function BookingFormSkeleton() {
  return (
    <div
      className='p-2 border-2 border-white'
      // className='p-4 sm:p-6 lg:p-8 rounded-lg bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(254,17,255,0.06),transparent_60%)] bg-[#05070A]'
    >
      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 '>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className='bg-transaprent min-h-40 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all border-cyan-400'
          />
        ))}
      </div>
      <div className='flex justify-end'>
        <Skeleton className='h-9 w-24 rounded-lg bg-transparent' />
      </div>
    </div>
  );
}
