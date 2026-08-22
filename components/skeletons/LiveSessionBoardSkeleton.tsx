// app/dashboard/staff/components/LiveSessionBoardSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

function StationCardSkeleton() {
  return (
    <div className='flex items-center justify-between border border-white/10 bg-white/[0.02] px-4 py-4'>
      <div className='flex items-center gap-2'>
        <Skeleton className='h-1.5 w-1.5 rounded-full' />
        <Skeleton className='h-4 w-20' />
      </div>
      <Skeleton className='h-6 w-14' />
    </div>
  );
}

export function LiveSessionBoardSkeleton() {
  return (
    <div className='min-w-0'>
      {/* Header */}
      <div className='flex flex-col md:flex-row flex-wrap items-start justify-between gap-3 min-w-0'>
        <div className='flex items-center gap-2'>
          <Skeleton className='size-8 shrink-0' />
          <Skeleton className='h-8 w-64' />
        </div>
        <Skeleton className='h-9 w-40' />
      </div>

      {/* Tabs */}
      <div className='mt-6 flex gap-2 overflow-x-auto'>
        {['ALL', 'PC', 'PS5', 'RACING SIM'].map((label) => (
          <Skeleton key={label} className='h-9 w-24 shrink-0' />
        ))}
      </div>

      {/* Section label */}
      <div className='mb-3 mt-6 flex items-center gap-3'>
        <Skeleton className='h-3 w-40' />
        <Skeleton className='h-px flex-1' />
      </div>

      {/* Station grid — matches your screenshot's card density */}
      <div className='grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4'>
        {Array.from({ length: 12 }).map((_, i) => (
          <StationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
