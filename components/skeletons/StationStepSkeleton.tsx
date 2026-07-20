import { Skeleton } from '../ui/skeleton';

export default function StationStepSkeleton() {
  return (
    <div className='flex flex-col items-center justify-center w-full gap-2'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className='bg-transparent min-h-15.5 flex-1 w-full rounded-xl border p-4 text-center transition-all border-cyan-400'
        />
      ))}
    </div>
  );
}
