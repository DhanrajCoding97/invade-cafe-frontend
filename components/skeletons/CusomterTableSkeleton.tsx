import { Skeleton } from '../ui/skeleton';

export function CustomersTableSkeleton() {
  return (
    <div className='w-full'>
      {/* Heading */}
      <div className='mb-6 space-y-2'>
        <Skeleton className='h-8 w-32 rounded-md' />
        <Skeleton className='h-4 w-24 rounded-md' />
      </div>
      {/* =========================
          SEARCH
          ========================= */}
      <Skeleton className='mb-4 h-10 w-full max-w-sm rounded-lg' />

      {/* =========================
          MOBILE — CUSTOMER CARDS
          ========================= */}
      <div className='flex flex-col gap-3 md:hidden'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='rounded-lg border border-cyan-400/20 bg-black/10 p-4'
          >
            {/* Customer identity */}
            <div className='mb-4 flex items-start justify-between gap-4'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-28 rounded-md' />
                <Skeleton className='h-3 w-36 rounded-md' />
              </div>

              <Skeleton className='h-6 w-16 rounded-full' />
            </div>

            {/* Customer details */}
            <div className='space-y-3'>
              <div className='flex items-center justify-between gap-4'>
                <Skeleton className='h-3 w-16 rounded-md' />
                <Skeleton className='h-3 w-28 rounded-md' />
              </div>

              <div className='flex items-center justify-between gap-4'>
                <Skeleton className='h-3 w-16 rounded-md' />
                <Skeleton className='h-3 w-32 rounded-md' />
              </div>

              <div className='flex items-center justify-between gap-4'>
                <Skeleton className='h-3 w-20 rounded-md' />
                <Skeleton className='h-3 w-24 rounded-md' />
              </div>
            </div>

            {/* Optional action area */}
            <div className='mt-4 flex justify-end border-t border-cyan-400/10 pt-4'>
              <Skeleton className='h-8 w-20 rounded-md' />
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          DESKTOP — TABLE
          ========================= */}
      <div className='hidden overflow-hidden rounded-lg border border-cyan-400/20 md:block'>
        {/* Table header */}
        <div className='grid grid-cols-5 gap-4 border-b border-cyan-400/20 bg-muted/20 px-4 py-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className='h-4 w-20 rounded-md' />
          ))}
        </div>

        {/* Table rows */}
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className='grid grid-cols-5 items-center gap-4 border-t border-cyan-400/10 px-4 py-4 first:border-t-0'
          >
            {/* Name */}
            <div className='space-y-2'>
              <Skeleton className='h-4 w-28 rounded-md' />
              <Skeleton className='h-3 w-36 rounded-md' />
            </div>

            {/* Email */}
            <Skeleton className='h-4 w-40 rounded-md' />

            {/* Phone */}
            <Skeleton className='h-4 w-28 rounded-md' />

            {/* Date / metadata */}
            <Skeleton className='h-4 w-24 rounded-md' />

            {/* Action */}
            <div className='flex justify-end gap-2'>
              <Skeleton className='h-8 w-16 rounded-md' />
            </div>
          </div>
        ))}
      </div>

      {/* =========================
          PAGINATION
          ========================= */}
      <div className='mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        {/* Rows per page */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-24 rounded-md' />
          <Skeleton className='h-8 w-12 rounded-md' />
        </div>

        {/* Pagination */}
        <div className='flex items-center gap-2'>
          <Skeleton className='h-4 w-24 rounded-md' />
          <Skeleton className='h-9 w-16 rounded-md' />
          <Skeleton className='h-9 w-16 rounded-md' />
        </div>
      </div>
    </div>
  );
}

export default CustomersTableSkeleton;
