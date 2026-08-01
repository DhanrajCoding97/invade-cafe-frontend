// GamesCatalogSection.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
type Category = 'all' | 'ps5' | 'pc' | 'vr' | 'racing';

interface Game {
  id: string;
  title: string;
  category: Exclude<Category, 'all'>;
  image: string;
  tags?: string[];
  featured?: boolean;
}

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ps5', label: 'PS5' },
  { value: 'pc', label: 'PC' },
  { value: 'racing', label: 'Racing' },
  { value: 'vr', label: 'VR' },
];

const GAMES: Game[] = [
  {
    id: 'gta5',
    title: 'GTA V',
    category: 'ps5',
    image: '/games/gta.jpg',
    tags: ['Adventure', 'Open World'],
  },
  {
    id: 'jumpForce',
    title: 'Jump Force',
    category: 'ps5',
    image: '/games/jumpforce.jpg',
    tags: ['Action', 'Fighting'],
  },
  {
    id: 'fc26',
    title: 'FC 26',
    category: 'ps5',
    image: '/games/fc.jpg',
    tags: ['Sports'],
  },
  {
    id: 'cricket24',
    title: 'Cricket 24',
    category: 'ps5',
    image: '/games/cricket24.jpg',
    tags: ['Sports'],
  },
  {
    id: 'wukong',
    title: 'Black Myth: Wukong',
    category: 'ps5',
    image: '/games/wukong.jpg',
    featured: true,
    tags: ['NEW', 'RPG', 'Adventure'],
  },
  {
    id: 'UnchartedLL',
    title: 'Uncharted Lost Legacy',
    category: 'ps5',
    image: '/games/unchartedLL.webp',
    tags: ['Open World', 'Adventure'],
  },
  {
    id: 'ac-bf',
    title: "Assassin's Creed Black Flag Resynced",
    category: 'ps5',
    image: '/games/acbf.webp',
    tags: ['NEW', 'RPG', 'Open World'],
  },
  {
    id: 'mortalKombat',
    title: 'Mortal Kombat',
    category: 'ps5',
    image: '/games/mortalkombat.jpg',
    tags: ['Action', 'Fighting'],
  },
  {
    id: 'spidey2',
    title: 'Spider-Man 2',
    category: 'ps5',
    image: '/games/spiderman2.jpg',
  },
  {
    id: 'cs2',
    title: 'CS 2',
    category: 'pc',
    image: '/games/cs2.png',
    tags: ['Fps', 'Action'],
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    category: 'pc',
    image: '/games/fortnite.jpg',
  },
  {
    id: 'valorant',
    title: 'Valorant',
    category: 'pc',
    image: '/games/valo.jpg',
  },
  {
    id: 'gt7',
    title: 'Gran Turismo 7',
    category: 'racing',
    image: '/games/granturismo7.jpg',
  },
  {
    id: 'forza',
    title: 'Forza Horizon 6',
    category: 'racing',
    image: '/games/forzahorizon6.jpg',
    tags: ['New', 'racing'],
  },
  {
    id: 'astrobot',
    title: 'Astro Bot',
    category: 'vr',
    image: '/games/astrobot.webp',
    tags: ['Open World'],
  },
];

function GameCard({ game }: { game: Game }) {
  return (
    <div
      className={[
        'group relative aspect-[3/4] overflow-hidden rounded-2xl border transition-colors',
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

      {game.tags && (
        <div className='absolute top-3 left-3 flex gap-1.5'>
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

export default function GamesCatalogSection() {
  const [active, setActive] = useState<Category>('all');

  const PREVIEW_LIMIT = 8;

  const filtered =
    active === 'all' ? GAMES : GAMES.filter((g) => g.category === active);

  const preview = filtered.slice(0, PREVIEW_LIMIT);
  const hasMore = filtered.length > PREVIEW_LIMIT;

  return (
    <section className='px-6 py-20'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-cyan-400'>
          <span className='h-px w-8 bg-cyan-400' />
          GAME LIBRARY
        </div>

        <h2 className='mb-3 bg-gradient-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-5xl font-extrabold text-transparent'>
          The Vault
        </h2>

        <p className='mb-8 max-w-xl text-white/60'>
          Every title, every setup. Filter by device and jump in.
        </p>

        <div className='mb-8 flex flex-wrap gap-2'>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={[
                'rounded-full border px-4 py-1.5 text-sm font-medium transition-colors',
                active === cat.value
                  ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                  : 'border-white/15 text-white/60 hover:border-white/30',
              ].join(' ')}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Mobile */}
        <ScrollArea className='-mx-6 px-6 sm:hidden'>
          <div
            className='grid grid-flow-col grid-rows-2 gap-3 pb-4'
            style={{ gridAutoColumns: '180px' }}
          >
            {preview.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        {/* Desktop / Tablet */}
        <div className='hidden sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
          {preview.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

        {/* View All */}
        {hasMore && (
          <div className='mt-8 flex justify-center'>
            <Link
              href='/games'
              className='rounded-md border border-cyan-400/40 px-6 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/10'
            >
              View all {filtered.length} games →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
