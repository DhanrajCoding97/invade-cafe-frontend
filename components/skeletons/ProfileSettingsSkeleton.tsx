import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSettingsSkeleton() {
  return (
    <div className='@container w-full overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#080a0d] sm:max-w-3xl'>
      {/* Header */}
      <div className='flex items-center justify-between border-b border-cyan-500/10 px-6 py-5'>
        <div className='flex items-center gap-3'>
          <Skeleton className='h-8 w-8 rounded bg-cyan-500/10' />

          <div>
            <Skeleton className='h-4 w-24 bg-white/10' />
            <Skeleton className='mt-2 h-2.5 w-40 bg-white/5' />
          </div>
        </div>

        <Skeleton className='h-7 w-16 rounded bg-white/5' />
      </div>

      <div className='px-6 py-6'>
        {/* Section 01 — AVATAR */}
        <SectionSkeleton width='w-20' />

        <div className='mb-8'>
          <div className='flex flex-col items-start gap-4 sm:flex-row sm:items-center'>
            {/* Avatar */}
            <Skeleton className='h-24 w-24 shrink-0 rounded-full bg-white/10' />

            {/* Avatar dropzone / upload area */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32 bg-white/10' />
              <Skeleton className='h-3 w-48 bg-white/5' />
              <Skeleton className='h-3 w-40 bg-white/5' />
            </div>
          </div>
        </div>

        {/* Section 02 — PERSONAL_INFO */}
        <SectionSkeleton width='w-32' />

        <div className='mb-8 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2'>
          <ProfileFieldSkeleton />
          <ProfileFieldSkeleton />
        </div>

        {/* Section 03 — ACCOUNT */}
        <SectionSkeleton width='w-24' />

        <div className='mb-5 grid grid-cols-1 gap-x-6 gap-y-5 @2xl:mb-8 sm:grid-cols-2'>
          <ProfileFieldSkeleton icon />
          <ProfileFieldSkeleton />
        </div>

        {/* Footer */}
        <div className='flex flex-col overflow-hidden rounded-lg border border-cyan-500/20 @2xl:flex-row @2xl:items-center @2xl:justify-between'>
          <div className='px-4 py-3 @2xl:px-5 @2xl:py-4'>
            <Skeleton className='h-3 w-48 bg-white/5' />
          </div>

          <div className='flex w-full border-t border-cyan-500/20 @2xl:w-auto @2xl:border-t-0'>
            <Skeleton className='h-12 flex-1 rounded-none bg-white/[0.03] @2xl:w-24 @2xl:flex-none' />

            <Skeleton
              className='h-12 flex-1 rounded-none border-l border-cyan-500/20 bg-cyan-500/5 @2xl:w-36 @2xl:flex-none'
              style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton({ width }: { width: string }) {
  return (
    <div className='mb-6 flex items-center gap-3'>
      <Skeleton className='h-3 w-7 bg-cyan-500/10' />
      <Skeleton className={`h-3 ${width} bg-white/10`} />
      <div className='h-px flex-1 bg-cyan-500/10' />
    </div>
  );
}

function ProfileFieldSkeleton({ icon = false }: { icon?: boolean }) {
  return (
    <div>
      <div className='mb-2 flex items-center gap-1.5'>
        {icon && <Skeleton className='h-2.5 w-2.5 bg-white/10' />}
        <Skeleton className='h-2.5 w-20 bg-cyan-500/10' />
      </div>

      <Skeleton className='h-11 w-full rounded-none bg-white/[0.03]' />
    </div>
  );
}
