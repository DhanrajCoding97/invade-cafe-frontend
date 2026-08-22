import { Skeleton } from '@/components/ui/skeleton';

export function StaffBookingDetailsSkeleton() {
  return (
    <div className='w-full rounded-2xl border border-white/10 p-3 sm:p-4 lg:p-6'>
      {/* Header */}
      <div>
        <div className='mb-1 flex items-center gap-2'>
          <Skeleton className='h-7 w-44 bg-white/10' />
        </div>

        <Skeleton className='mt-2 h-3 w-48 bg-white/5' />

        {/* Razorpay order id */}
        <Skeleton className='mt-2 h-3 w-64 bg-white/5' />
      </div>

      {/* Customer card */}
      <div className='my-4 rounded-2xl border border-[#28F1FF]/10 bg-[#28F1FF]/5 p-5'>
        <Skeleton className='h-5 w-40 bg-white/10' />
        <Skeleton className='mt-2 h-4 w-32 bg-white/5' />
        <Skeleton className='mt-1 h-3 w-52 bg-white/5' />
      </div>

      {/* Status + Payment pills */}
      <div className='mb-4 flex flex-wrap gap-3'>
        <Skeleton className='h-7 w-24 rounded-full bg-white/10' />
        <Skeleton className='h-7 w-28 rounded-full bg-white/10' />
        <Skeleton className='h-7 w-36 rounded-full bg-white/10' />
      </div>

      {/* QR block */}
      {/* <div className='mb-4 flex flex-col items-center rounded-2xl border border-white/10 p-6'>
        <Skeleton className='mb-4 h-3 w-48 bg-white/5' />

        <div className='rounded-xl bg-white p-3'>
          <Skeleton className='h-[140px] w-[140px] bg-neutral-200' />
        </div>

        <Skeleton className='mt-4 h-3 w-16 bg-white/5' />
        <Skeleton className='mt-2 h-4 w-48 bg-white/10' />
      </div> */}

      {/* Booking details */}
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
        <DetailTileSkeleton />
        <DetailTileSkeleton />
        <DetailTileSkeleton />
        <DetailTileSkeleton />
        <DetailTileSkeleton />
      </div>

      {/* Bill summary */}
      <div className='my-4 rounded-2xl border border-white/10 p-5'>
        <Skeleton className='mb-4 h-4 w-28 bg-white/10' />

        <div className='mb-2 flex justify-between'>
          <Skeleton className='h-4 w-32 bg-white/5' />
          <Skeleton className='h-4 w-16 bg-white/5' />
        </div>

        <div className='mb-2 flex justify-between'>
          <Skeleton className='h-4 w-40 bg-white/5' />
          <Skeleton className='h-4 w-14 bg-white/5' />
        </div>

        <div className='mt-3 border-t border-white/10 pt-3'>
          <div className='flex justify-between'>
            <Skeleton className='h-4 w-28 bg-white/10' />
            <Skeleton className='h-5 w-20 bg-white/10' />
          </div>
        </div>
      </div>

      {/* Payment details */}
      <div className='mb-6 rounded-2xl border border-white/10 p-5'>
        <Skeleton className='mb-2 h-4 w-32 bg-white/10' />

        <Skeleton className='mb-4 h-3 w-56 bg-white/5' />

        <div className='space-y-2'>
          <div className='flex justify-between'>
            <Skeleton className='h-4 w-20 bg-white/5' />
            <Skeleton className='h-4 w-16 bg-white/5' />
          </div>

          <div className='flex justify-between'>
            <Skeleton className='h-4 w-32 bg-white/5' />
            <Skeleton className='h-4 w-14 bg-white/5' />
          </div>

          <div className='my-3 border-t border-white/10' />

          <div className='flex justify-between'>
            <Skeleton className='h-4 w-16 bg-white/10' />
            <Skeleton className='h-5 w-20 bg-white/10' />
          </div>

          <Skeleton className='mt-3 h-9 w-full rounded-lg bg-white/5' />
        </div>
      </div>

      {/* Actions */}
      <div className='flex flex-wrap gap-2'>
        <Skeleton className='h-9 w-28 rounded-md bg-white/10' />
        <Skeleton className='h-9 w-32 rounded-md bg-white/10' />
      </div>
    </div>
  );
}

function DetailTileSkeleton() {
  return (
    <div className='flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4'>
      <Skeleton className='h-8 w-8 rounded-lg bg-white/5' />

      <div className='min-w-0 flex-1'>
        <Skeleton className='h-3 w-16 bg-white/5' />
        <Skeleton className='mt-2 h-4 w-28 bg-white/10' />
      </div>
    </div>
  );
}
