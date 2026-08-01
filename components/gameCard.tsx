import type { GameRow } from '@/types';
import Image from 'next/image';
import { Badge } from './ui/badge';

export default function GameCard({ game }: { game: GameRow }) {
  return (
    <div
      className={[
        'group relative aspect-[3/4] overflow-hidden rounded-2xl border transition-all duration-300',
        game.featured
          ? 'border-cyan-400 shadow-[0_0_24px_-4px_rgba(0,243,255,0.45)]'
          : 'border-cyan-400/20 hover:border-cyan-400/60',
      ].join(' ')}
    >
      <Image
        src={game.image_url}
        alt={game.title}
        fill
        sizes='(max-width: 640px) 180px, (max-width: 1024px) 33vw, 25vw'
        className='object-cover transition-transform duration-500 group-hover:scale-105'
      />

      {/* Dark gradient */}
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent' />

      {/* Featured pill */}
      {game.featured && (
        <div className='absolute right-3 top-3 bg-black/45  rounded-full border border-cyan-200 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur'>
          Featured
        </div>
      )}

      {/* Bottom content */}
      <div className='absolute inset-x-0 bottom-0 p-4'>
        <h3 className='line-clamp-2 text-base font-bold text-white drop-shadow'>
          {game.title}
        </h3>

        {game.tags?.length > 0 && (
          <div className='mt-2 flex flex-wrap gap-1.5'>
            {game.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                className='rounded-full border border-white/15 bg-black/45 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-cyan-200 backdrop-blur-sm'
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
