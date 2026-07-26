import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function GallerySkeleton() {
  return (
    <div className='h-full w-full'>
      {/* Track — justify-center mirrors Embla's align: 'center', so the
          middle slide centers and the side slides clip symmetrically */}
      <div className='h-full overflow-hidden'>
        <div className='flex h-full justify-center'>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className='min-w-0 shrink-0 grow-0 basis-[85%] px-2 sm:basis-[70%] md:basis-[60%]'
            >
              <Skeleton
                className={`h-full w-full rounded-lg bg-white/10 transition-all duration-500 ${
                  index === 1 ? 'scale-100' : 'scale-[0.93]'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className='mt-4 flex items-center justify-between'>
        <Skeleton className='h-10 w-10 shrink-0 rounded-full bg-white/10' />
        <div className='flex gap-2'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-2 rounded-full bg-white/10 ${i === 2 ? 'w-6' : 'w-2'}`}
            />
          ))}
        </div>
        <Skeleton className='h-10 w-10 shrink-0 rounded-full bg-white/10' />
      </div>
    </div>
  );
}