// import type { GameRow } from '@/types';
// import Image from 'next/image';
// import { Badge } from './ui/badge';
// import { useIsMobile } from '@/hooks/use-mobile';
// export default function GameCard({ game }: { game: GameRow }) {
//   const isMobile = useIsMobile();
//   const visibleTags = isMobile ? game.tags.slice(0, 2) : game.tags.slice(0, 3);
//   return (
//     <div
//       className={[
//         'group relative aspect-3/4 overflow-hidden rounded-2xl border transition-all duration-300',
//         game.featured
//           ? 'border-cyan-400 shadow-[0_0_24px_-4px_rgba(0,243,255,0.45)]'
//           : 'border-cyan-400/20 hover:border-cyan-400/60',
//       ].join(' ')}
//     >
//       <Image
//         src={game.image_url}
//         alt={game.title}
//         fill
//         sizes='(max-width: 640px) 180px, (max-width: 1024px) 33vw, 25vw'
//         className='object-cover transition-transform duration-500 group-hover:scale-105'
//       />

//       {/* Dark gradient */}
//       <div className='absolute inset-0 bg-linear-to-t from-black via-black/35 to-transparent' />

//       {/* Featured pill */}
//       {game.featured && (
//         <div className='absolute right-3 top-3 bg-black/45  rounded-full border border-cyan-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur'>
//           Featured
//         </div>
//       )}

//       {/* Bottom content */}
//       <div className='absolute inset-x-0 bottom-0 p-4'>
//         <h3 className='line-clamp-2 text-sm sm:text-base font-bold text-white drop-shadow'>
//           {game.title}
//         </h3>

//         {game.tags?.length > 0 && (
//           <div className='mt-2 flex flex-wrap gap-1.5'>
//             {visibleTags.map((tag, index) => (
//               <Badge
//                 key={index}
//                 className='rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-200 backdrop-blur-sm'
//               >
//                 {tag}
//               </Badge>
//             ))}
//             {game.tags.length > visibleTags.length && (
//               <Badge className='rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-200 backdrop-blur-sm'>
//                 + {game.tags.length - visibleTags.length}
//               </Badge>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import type { GameRow } from '@/types';
import Image from 'next/image';
import { Badge } from './ui/badge';

export default function GameCard({ game }: { game: GameRow }) {
  const tags = game.tags ?? [];
  const shown = tags.slice(0, 3);
  const extra = tags.length - 2; // mobile shows 2

  return (
    <article className='group relative aspect-3/4 overflow-hidden rounded-2xl border border-border bg-card'>
      <Image
        src={game.image_url}
        alt={game.title}
        fill
        sizes='(max-width: 640px) 180px, (max-width: 1024px) 33vw, 25vw'
        className='object-cover transition-transform duration-500 group-hover:scale-105'
      />
      {/* image overlay */}
      <div className='absolute inset-0 bg-black/15' />
      {/* bottom overlay */}
      <div className='absolute inset-0 bg-linear-to-t from-black/90 via-black/35 to-transparent' />
      {/* <div className='absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-background via-background/70 to-transparent' /> */}

      {game.featured && (
        <Badge
          variant='secondary'
          // className='absolute right-2 top-2 text-[10px] uppercase tracking-wide'
          className='absolute right-2 top-2 bg-background/80 backdrop-blur-md border-white/10'
        >
          Featured
        </Badge>
      )}

      <div className='absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-4'>
        <h3 className='line-clamp-1 text-sm font-semibold text-white [text-shadow:0_2px_8px_rgb(0_0_0/0.8)]'>
          {game.title}
        </h3>

        {tags.length > 0 && (
          <div className='flex min-w-0 flex-nowrap items-center gap-1 overflow-hidden'>
            {shown.map((tag, i) => (
              <Badge
                key={tag}
                variant='outline'
                className={`shrink-0 truncate px-1.5 py-0 text-[10px] uppercase sm:px-2 sm:text-xs ${
                  i === 2 ? 'hidden sm:inline-flex' : ''
                }`}
              >
                {tag}
              </Badge>
            ))}
            {extra > 0 && (
              <Badge
                variant='outline'
                className='shrink-0 px-1.5 py-0 text-[10px] sm:hidden'
              >
                +{extra}
              </Badge>
            )}
            {tags.length > 3 && (
              <Badge
                variant='outline'
                className='hidden shrink-0 px-2 py-0 text-xs sm:inline-flex'
              >
                +{tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
