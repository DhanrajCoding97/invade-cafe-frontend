// app/games/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import GameCard from '@/components/gameCard';
import { CATEGORIES, type Category, type Game } from '@/types/index';

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
  { id: 'cs2', title: 'CS 2', category: 'pc', image: '/games/cs2.jpg' },
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

export default function GamesPage() {
  const [active, setActive] = useState<Category>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const byCategory =
      active === 'all' ? GAMES : GAMES.filter((g) => g.category === active);
    if (!query.trim()) return byCategory;
    const q = query.trim().toLowerCase();
    return byCategory.filter((g) => g.title.toLowerCase().includes(q));
  }, [active, query]);

  return (
    <main className='min-h-screen px-6 pb-24 pt-32'>
      <div className='mx-auto max-w-6xl'>
        <div className='mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-cyan-400'>
          <span className='h-px w-8 bg-cyan-400' />
          GAME LIBRARY
        </div>

        <h1 className='mb-3 bg-linear-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-5xl font-extrabold text-transparent'>
          The Vault
        </h1>

        <p className='mb-8 max-w-xl text-white/60'>
          {GAMES.length} titles across PC, PS5, VR, and racing sims. Search or
          filter to find yours.
        </p>

        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='flex flex-wrap gap-2'>
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

          <div className='relative w-full sm:w-64'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40' />
            <input
              type='text'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search games...'
              className='w-full rounded-md border border-white/15 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/60 focus:outline-none'
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-white/10 py-24 text-center'>
            <p className='text-white/60'>No games match your search.</p>
          </div>
        ) : (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
