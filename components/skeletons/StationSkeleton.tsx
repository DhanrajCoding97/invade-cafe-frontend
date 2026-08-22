// components/skeletons/StationsSkeleton.tsx

import { Skeleton } from '@/components/ui/skeleton';

export function StationsSkeleton() {
  return (
    <>
      {/* Mobile */}
      <div className='md:hidden'>
        {/* Tabs */}
        <div className='flex w-full rounded-md bg-white/5 p-1'>
          <Skeleton className='h-9 flex-1 bg-white/10' />
          <Skeleton className='ml-1 h-9 flex-1 bg-white/5' />
          <Skeleton className='ml-1 h-9 flex-1 bg-white/5' />
          <Skeleton className='ml-1 h-9 flex-1 bg-white/5' />
        </div>

        {/* Mobile cards */}
        <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <StationCardSkeleton key={i} />
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className='hidden md:block'>
        {Array.from({ length: 2 }).map((_, groupIndex) => (
          <div key={groupIndex} className='mb-8'>
            {/* Type heading */}
            <div className='mb-3 flex items-center gap-3'>
              <Skeleton className='h-4 w-20 bg-cyan-400/70' />
              <div className='h-px flex-1 bg-linear-to-r from-cyan-500/30 to-transparent' />
            </div>

            {/* Station cards */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <StationCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StationCardSkeleton() {
  return (
    <div className='overflow-hidden rounded-xl border border-cyan-500/10 bg-[#080a0d]'>
      {/* Card header */}
      <div className='flex items-center justify-between border-b border-white/5 px-4 py-4'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-9 w-9 rounded-lg bg-cyan-500/10' />

          <div className='space-y-2'>
            <Skeleton className='h-3.5 w-24 bg-white/10' />
            <Skeleton className='h-2.5 w-16 bg-white/5' />
          </div>
        </div>

        <Skeleton className='h-6 w-16 rounded-full bg-white/5' />
      </div>

      {/* Card content */}
      <div className='space-y-4 p-4'>
        {/* Status */}
        <div className='flex items-center justify-between'>
          <Skeleton className='h-2.5 w-16 bg-white/5' />
          <Skeleton className='h-3 w-20 bg-cyan-500/10' />
        </div>

        {/* Info rows */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-2.5 w-20 bg-white/5' />
            <Skeleton className='h-3 w-16 bg-white/10' />
          </div>

          <div className='flex items-center justify-between'>
            <Skeleton className='h-2.5 w-24 bg-white/5' />
            <Skeleton className='h-3 w-20 bg-white/10' />
          </div>
        </div>

        {/* Actions */}
        <div className='flex gap-2 pt-1'>
          <Skeleton className='h-9 flex-1 rounded-md bg-white/5' />
          <Skeleton className='h-9 w-10 rounded-md bg-white/5' />
        </div>
      </div>
    </div>
  );
}
