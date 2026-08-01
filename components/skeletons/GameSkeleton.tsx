import { Skeleton } from '@/components/ui/skeleton';

export function GameCardSkeleton() {
  return (
    <div className='relative aspect-3/4 overflow-hidden rounded-2xl border border-cyan-400/20'>
      {/* Image */}
      <Skeleton className='absolute inset-0' />

      {/* Gradient overlay */}
      <div className='absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent' />

      {/* Content */}
      <div className='absolute bottom-4 left-4 right-4 flex flex-col gap-3'>
        {/* Title */}
        <Skeleton className='h-6 w-3/4' />

        {/* Tags */}
        <div className='flex flex-wrap gap-2'>
          <Skeleton className='h-5 w-24 rounded-full' />
          <Skeleton className='h-5 w-20 rounded-full' />
        </div>
      </div>
    </div>
  );
}
