'use client';

import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import GameCard from '@/components/gameCard';
import { CATEGORIES, type GameCategory } from '@/types/index';
import { useQuery } from '@tanstack/react-query';
import { fetchGames, gameKeys } from '@/lib/queries/games';
import { GameCardSkeleton } from '@/components/skeletons/GameSkeleton';

export default function GamesClient() {
  const [active, setActive] = useState<GameCategory>('all');
  const [query, setQuery] = useState('');

  const { data: games = [], isLoading } = useQuery({
    queryKey: gameKeys.all,
    queryFn: fetchGames,
  });

  const filtered = useMemo(() => {
    if (isLoading) return [];

    const byCategory =
      active === 'all' ? games : games.filter((g) => g.category === active);

    if (!query.trim()) return byCategory;

    const q = query.trim().toLowerCase();
    return byCategory.filter((g) => g.title.toLowerCase().includes(q));
  }, [games, active, query, isLoading]);

  return (
    <main className='min-h-screen px-6 pb-24 pt-32'>
      <div className='mx-auto max-w-6xl flex flex-col gap-4'>
        <header className='mb-4'>
          <div className='mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-cyan-400'>
            <span className='h-px w-8 bg-cyan-400' />
            GAME LIBRARY
          </div>

          <h1 className='mb-3 bg-linear-to-r from-cyan-400 via-white to-fuchsia-400 bg-clip-text text-[clamp(2.3rem,.7174rem+3.913vw,3.75rem)] font-extrabold text-transparent'>
            Our Games Catalogue
          </h1>

          <p className=' text-white/60 text-sm sm:text-base lg:text-xl'>
            {games.length} titles across PC, PS5, VR, and racing sims. Search or
            filter to find yours.
          </p>
        </header>

        <section className='space-y-4 text-white/70'>
          <h2 className='text-xl sm:text-2xl text-[#ddd]/80 font-bold '>
            Games to Play at Invade Gaming Cafe
          </h2>

          <p className='text-sm sm:text-base text-[#ddd]/60'>
            Looking for the best games to play at a gaming cafe? Invade Gaming
            Cafe offers a growing library of popular PC, PS5, VR, and racing
            games for solo players, friends, and competitive gaming sessions.
            Browse our game catalogue to see what you can play during your next
            visit and find the right game for your preferred gaming setup.
          </p>

          <p className='text-sm sm:text-base text-[#ddd]/60'>
            Our gaming PCs are built for smooth competitive gameplay across
            popular esports and multiplayer titles such as Valorant,
            Counter-Strike 2, Apex Legends, Fortnite, and other PC games.
            Whether you enjoy competitive shooters, action games, sports titles,
            or open-world adventures, you can choose from a variety of games and
            play on a high-performance gaming PC.
          </p>

          <p className='text-sm sm:text-base text-[#ddd]/60'>
            Console gamers can enjoy a selection of PlayStation 5 games on large
            4K displays. From multiplayer games and sports titles to
            action-packed adventures and console exclusives, our PS5 gaming
            stations are designed for both casual gaming and competitive
            sessions with friends.
          </p>

          <p className='text-sm sm:text-base text-[#ddd]/60'>
            For something different, try our racing games on dedicated racing
            simulator setups with force-feedback steering wheels and pedal
            controls. We also offer immersive VR gaming through our PSVR
            station, giving you another way to experience your favourite games.
          </p>

          <p className='text-sm sm:text-base text-[#ddd]/60'>
            Planning a gaming session with friends? Browse the catalogue, filter
            games by PC, PS5, racing, or VR, and discover what is available at
            Invade Gaming Cafe. You can also reserve your gaming station online
            in advance, making it easy to plan your next gaming session before
            you arrive.
          </p>
        </section>

        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
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

        {isLoading ? (
          <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
            {Array.from({ length: 10 }).map((_, i) => (
              <GameCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
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
