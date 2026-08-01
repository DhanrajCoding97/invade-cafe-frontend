// components/games/GameCard.tsx
import Image from 'next/image';
import { type Game } from '@/types';

export default function GameCard({ game }: { game: Game }) {
  return (
    <div
      className={[
        'group relative aspect-3/4 overflow-hidden rounded-2xl border transition-colors',
        game.featured
          ? 'border-cyan-400 shadow-[0_0_24px_-4px_rgba(0,243,255,0.4)]'
          : 'border-cyan-400/20 hover:border-cyan-400/50',
      ].join(' ')}
    >
      <Image
        src={game.image}
        alt={game.title}
        fill
        className='object-cover transition-transform duration-300 group-hover:scale-105'
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent' />

      {game.tags && game.tags.length > 0 && (
        <div className='absolute top-3 left-3 flex flex-wrap gap-1.5'>
          {game.tags.map((tag) => (
            <span
              key={tag}
              className='rounded bg-cyan-400 px-1.5 py-0.5 text-[10px] font-bold text-black'
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className='absolute bottom-0 left-0 right-0 p-3'>
        <p className='text-sm font-bold text-white'>{game.title}</p>
      </div>
    </div>
  );
}
