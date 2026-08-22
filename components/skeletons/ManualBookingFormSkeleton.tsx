// ManualBookingFormSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton';

function SectionHeaderSkeleton() {
  return (
    <div className='flex items-center gap-2'>
      <Skeleton className='h-3 w-6 rounded-none' />
      <Skeleton className='h-3 w-28 rounded-none' />
    </div>
  );
}

export default function ManualBookingFormSkeleton() {
  return (
    <div className='relative flex w-full flex-col bg-black sm:max-w-3xl border border-[#28F1FF]/15'>
      {/* ---------- Sticky terminal header ---------- */}
      <header className='sticky top-0 z-40 flex h-14 items-center justify-between border-b border-[#28F1FF]/15 bg-black/80 px-4 backdrop-blur-md'>
        <div className='flex min-w-0 items-center gap-3'>
          <Skeleton className='size-8 shrink-0 rounded-none' />
          <div className='space-y-1.5'>
            <Skeleton className='h-3 w-28 rounded-none' />
            <Skeleton className='h-2 w-20 rounded-none' />
          </div>
        </div>
        <Skeleton className='h-6 w-16 shrink-0 rounded-none' />
      </header>

      <div className='flex flex-col gap-8 p-4'>
        {/* ---------- 01 CUSTOMER_INFO ---------- */}
        <section className='space-y-4'>
          <SectionHeaderSkeleton />

          <div className='space-y-1.5'>
            <Skeleton className='h-2.5 w-20 rounded-none' />
            <Skeleton className='h-11 w-full rounded-none' />
          </div>

          <div className='space-y-1.5'>
            <Skeleton className='h-2.5 w-24 rounded-none' />
            <Skeleton className='h-11 w-full rounded-none' />
          </div>
        </section>

        {/* ---------- 02 SESSION_CONFIG ---------- */}
        <section className='space-y-4'>
          <SectionHeaderSkeleton />

          {/* Device chips */}
          <div className='space-y-1.5'>
            <Skeleton className='h-2.5 w-14 rounded-none' />
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-4'>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className='h-11 rounded-none' />
              ))}
            </div>
          </div>

          {/* Station chip grid */}
          <div className='space-y-1.5'>
            <div className='flex items-end justify-between'>
              <Skeleton className='h-2.5 w-28 rounded-none' />
              <Skeleton className='h-2 w-14 rounded-none' />
            </div>
            <div className='grid grid-cols-4 gap-2 sm:grid-cols-5'>
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className='h-11 rounded-none' />
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 03 TIMELINE ---------- */}
        <section className='space-y-4'>
          <SectionHeaderSkeleton />

          {/* Start now toggle row */}
          <div className='flex items-center justify-between border border-[#28F1FF]/15 bg-[#070a0c]/60 p-4'>
            <div className='space-y-1.5'>
              <Skeleton className='h-2.5 w-32 rounded-none' />
              <Skeleton className='h-2 w-40 rounded-none' />
            </div>
            <Skeleton className='size-6 rounded-none' />
          </div>

          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
            <div className='space-y-1.5'>
              <Skeleton className='h-2.5 w-10 rounded-none' />
              <Skeleton className='h-11 w-full rounded-none' />
            </div>
            <div className='space-y-1.5'>
              <Skeleton className='h-2.5 w-16 rounded-none' />
              <Skeleton className='h-11 w-full rounded-none' />
            </div>
            <div className='space-y-1.5 sm:col-span-2'>
              <Skeleton className='h-2.5 w-24 rounded-none' />
              <Skeleton className='h-11 w-full rounded-none' />
            </div>
          </div>
        </section>

        {/* ---------- 04 PAYMENT_METHOD ---------- */}
        <section className='space-y-4'>
          <SectionHeaderSkeleton />

          <div className='space-y-1.5'>
            <Skeleton className='h-2.5 w-16 rounded-none' />
            <div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-11 rounded-none' />
              ))}
            </div>
          </div>

          <div className='space-y-1.5'>
            <Skeleton className='h-2.5 w-32 rounded-none' />
            <Skeleton className='h-11 w-full rounded-none' />
          </div>

          <div className='space-y-1.5'>
            <Skeleton className='h-2.5 w-36 rounded-none' />
            <Skeleton className='h-20 w-full rounded-none' />
          </div>
        </section>
      </div>

      {/* ---------- Sticky bottom total + submit ---------- */}
      <footer className='sticky bottom-0 z-40 p-4'>
        <div className='border p-2 border-[#28F1FF]/30 bg-black/95 backdrop-blur-xl'>
          <div className='flex flex-col gap-2 xm:flex-row items-stretch'>
            <div className='flex gap-2 items-center sm:items-start flex-1 sm:flex-col justify-center sm:border-r border-[#28F1FF]/20 px-4 py-3'>
              <Skeleton className='h-2.5 w-24 rounded-none' />
              <Skeleton className='h-6 w-16 rounded-none' />
            </div>
            <Skeleton className='flex-[1.2] h-11 rounded-none' />
          </div>
        </div>
      </footer>
    </div>
  );
}
