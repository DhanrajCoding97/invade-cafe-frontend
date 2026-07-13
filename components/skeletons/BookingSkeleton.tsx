import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function BookingFormSkeleton() {
  return (
    <div className='space-y-4 bg-transparent'>
      {/* <Skeleton className='h-4 w-32 bg-white/10' /> */}

      <div className='grid grid-cols-1 gap-3 md:grid-cols-2 '>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton
            key={i}
            className='min-h-40 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all border-cyan-400'
          />
        ))}
      </div>

      <div className='flex justify-end'>
        <Skeleton className='h-9 w-24 rounded-lg bg-white/10' />
      </div>
    </div>
  );
}
