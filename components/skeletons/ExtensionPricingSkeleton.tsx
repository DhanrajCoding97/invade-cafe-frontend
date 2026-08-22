import { Skeleton } from '@/components/ui/skeleton';

const DURATIONS = [15, 30, 60, 120];
const ROWS = [
  'PC',
  'PSVR',
  'Racing Sim · Single',
  'Racing Sim · Multiplayer',
  'PS5 · 1 Player',
  'PS5 · 2 Players',
  'PS5 · 3 Players',
  'PS5 · 4 Players',
];

function HeaderSkeleton() {
  return (
    <div className='flex items-center justify-between border-b border-cyan-500/10 px-3 py-5 sm:px-5 lg:px-6'>
      <div className='flex items-center gap-3'>
        <Skeleton className='h-8 w-8 rounded bg-cyan-500/10' />

        <div className='space-y-1.5'>
          <Skeleton className='h-3.5 w-32 bg-white/10 sm:w-40' />
          <Skeleton className='h-2.5 w-24 bg-white/5' />
        </div>
      </div>

      <Skeleton className='h-7 w-16 rounded bg-white/5' />
    </div>
  );
}

function DesktopTableSkeleton() {
  return (
    <div className='hidden overflow-x-auto sm:block'>
      <table className='w-full text-sm'>
        <thead>
          <tr>
            <th className='pb-3 pr-4 text-left'>
              <Skeleton className='h-3 w-24 bg-white/10' />
            </th>

            {DURATIONS.map((duration) => (
              <th key={duration} className='px-2 pb-3 text-left'>
                <Skeleton className='h-3 w-14 bg-white/10' />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {ROWS.map((_, rowIndex) => (
            <tr key={rowIndex} className='border-t border-cyan-500/10'>
              <td className='py-4 pr-4'>
                <Skeleton
                  className={`h-3 bg-white/10 ${
                    rowIndex === 2 || rowIndex === 3 ? 'w-36' : 'w-24'
                  }`}
                />
              </td>

              {DURATIONS.map((duration) => (
                <td key={duration} className='px-2 py-3'>
                  <Skeleton className='h-10 w-24 rounded-md bg-white/5' />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MobileCardsSkeleton() {
  return (
    <div className='flex flex-col gap-4 sm:hidden'>
      {ROWS.map((_, rowIndex) => (
        <div
          key={rowIndex}
          className='rounded-lg border border-cyan-500/10 bg-black/30 p-4'
        >
          <Skeleton
            className={`mb-4 h-3 bg-white/10 ${
              rowIndex === 2 || rowIndex === 3 ? 'w-36' : 'w-24'
            }`}
          />

          <div className='grid grid-cols-2 gap-3'>
            {DURATIONS.map((duration) => (
              <div key={duration}>
                <Skeleton className='mb-2 h-2.5 w-12 bg-white/5' />
                <Skeleton className='h-10 w-full rounded-md bg-white/5' />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ActionsSkeleton() {
  return (
    <div className='mt-6 flex flex-col overflow-hidden rounded-lg border border-cyan-500/20 sm:flex-row sm:items-center sm:justify-between'>
      <div className='px-4 py-3 sm:px-5 sm:py-4'>
        <Skeleton className='h-2.5 w-48 bg-white/5' />
      </div>

      <div className='flex w-full border-t border-cyan-500/10 sm:w-auto sm:border-t-0'>
        <Skeleton className='h-12 flex-1 rounded-none bg-transparent sm:w-24 sm:flex-none' />

        <Skeleton className='h-12 flex-1 rounded-none bg-cyan-500/10 sm:w-36 sm:flex-none' />
      </div>
    </div>
  );
}

export function ExtensionPricingSkeleton() {
  return (
    <div className='w-full overflow-hidden rounded-2xl border border-cyan-500/10 bg-[#080a0d] sm:max-w-4xl'>
      <HeaderSkeleton />

      <div className='px-4 py-6 sm:px-6'>
        <DesktopTableSkeleton />
        <MobileCardsSkeleton />
        <ActionsSkeleton />
      </div>
    </div>
  );
}
