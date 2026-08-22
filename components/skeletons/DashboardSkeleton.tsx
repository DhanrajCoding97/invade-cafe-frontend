import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-8 w-56' />
        <Skeleton className='h-4 w-28' />
      </div>

      {/* KPI cards */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className='rounded-xl border border-white/10 bg-white/5 p-4 space-y-3'
          >
            <Skeleton className='h-3 w-24' />
            <Skeleton className='h-7 w-16' />
            <Skeleton className='h-3 w-32' />
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
        <Skeleton className='mb-4 h-4 w-40' />
        <Skeleton className='h-64 w-full' />
      </div>

      {/* Upcoming bookings */}
      <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
        <div className='mb-3 flex items-center justify-between'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-16' />
        </div>
        <div className='space-y-3'>
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className='flex items-center justify-between border-t border-white/5 py-2 first:border-0'
            >
              <Skeleton className='h-3 w-10' />
              <Skeleton className='h-3 w-24' />
              <Skeleton className='h-3 w-12' />
              <Skeleton className='h-3 w-14' />
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className='flex flex-wrap gap-3'>
        <Skeleton className='h-10 w-36 rounded-lg' />
        <Skeleton className='h-10 w-32 rounded-lg' />
      </div>
    </div>
  );
}
