import { Skeleton } from '../ui/skeleton';

export default function StationStepSkeleton() {
  return (
    <div className='space-y-2 w-full'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton
          key={i}
          className='bg-transparent h-[62px] flex-1 w-full rounded-xl border p-4 text-center transition-all border-cyan-400'
        />
      ))}
    </div>
  );
}
