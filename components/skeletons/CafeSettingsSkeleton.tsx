import { Skeleton } from '@/components/ui/skeleton';

const PRICING_FIELDS = [
  'PC Rate',
  'PSVR Rate',
  'PS5 · 1 Player',
  'PS5 · 2 Players',
  'PS5 · 3 Players',
  'PS5 · 4 Players',
  'Racing Sim · Single',
  'Racing Sim · Multiplayer',
];

function HeaderSkeleton() {
  return (
    <div className='flex items-center justify-between border-b border-cyan-500/10 px-3 py-5 sm:px-5 lg:px-6'>
      <div className='flex items-center gap-3'>
        {/* Settings icon */}
        <Skeleton className='h-8 w-8 rounded bg-cyan-500/10' />

        <div className='space-y-1.5'>
          <Skeleton className='h-3.5 w-28 bg-white/10 sm:w-36' />
          <Skeleton className='h-2.5 w-24 bg-white/5' />
        </div>
      </div>

      {/* OWNER badge */}
      <Skeleton className='h-7 w-16 rounded bg-white/5' />
    </div>
  );
}

function SectionHeaderSkeleton() {
  return (
    <div className='mb-6 flex items-center gap-3'>
      <Skeleton className='h-3 w-7 bg-cyan-500/10' />
      <Skeleton className='h-3 w-16 bg-white/10' />
      <div className='h-px flex-1 bg-cyan-500/10' />
    </div>
  );
}

function InputSkeleton() {
  return (
    <div className='space-y-2'>
      <Skeleton className='h-2.5 w-28 bg-white/5' />
      <Skeleton className='h-10 w-full rounded-md bg-white/5' />
    </div>
  );
}

function PricingSkeleton() {
  return (
    <>
      <SectionHeaderSkeleton />

      <div className='mb-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2'>
        {PRICING_FIELDS.map((field) => (
          <InputSkeleton key={field} />
        ))}
      </div>
    </>
  );
}

function CafeHoursSkeleton() {
  return (
    <>
      <SectionHeaderSkeleton />

      <div className='mb-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2'>
        <InputSkeleton />
        <InputSkeleton />
      </div>
    </>
  );
}

function FooterSkeleton() {
  return (
    <div className='flex flex-col overflow-hidden rounded-lg border border-cyan-500/20 sm:flex-row sm:items-center sm:justify-between'>
      {/* Unsaved message */}
      <div className='px-4 py-3 sm:px-5 sm:py-4'>
        <Skeleton className='h-2.5 w-48 bg-white/5' />
      </div>

      {/* Actions */}
      <div className='flex w-full border-t border-cyan-500/10 sm:w-auto sm:border-t-0'>
        <Skeleton className='h-12 flex-1 rounded-none bg-transparent sm:w-24 sm:flex-none' />

        <Skeleton className='h-12 flex-1 rounded-none bg-cyan-500/10 sm:w-36 sm:flex-none' />
      </div>
    </div>
  );
}

export function CafeSettingsSkeleton() {
  return (
    <div className='w-full overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#080a0d] sm:max-w-4xl'>
      <HeaderSkeleton />

      <div className='px-3 py-6 sm:px-5 lg:px-6'>
        <PricingSkeleton />
        <CafeHoursSkeleton />
        <FooterSkeleton />
      </div>
    </div>
  );
}
