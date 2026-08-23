'use client';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { gameKeys, fetchGames } from '@/lib/queries/games';
import { useQuery } from '@tanstack/react-query';
import GameCard from '../gameCard';
import { CATEGORIES, type GameCategory } from '@/types/index';
import { GameCardSkeleton } from '../skeletons/GameSkeleton';
import TextReveal from '../gsap/TextReveal';
import CardsReveal from '../gsap/CardReveal';
import LineReveal from '../gsap/LineReveal';

export default function GamesCatalogSection() {
  const sectionRef = useRef(null);
  const buttonsRef = useRef(null);
  const mobileCardsRef = useRef(null);
  const desktopCardsRef = useRef(null);
  const ViewBtnRef = useRef(null);
  const [active, setActive] = useState<GameCategory>('all');
  const { data: games = [], isLoading } = useQuery({
    queryKey: gameKeys.all,
    queryFn: fetchGames,
  });

  const PREVIEW_LIMIT = 8;

  const filtered =
    active === 'all' ? games : games.filter((g) => g.category === active);

  const preview = filtered.slice(0, PREVIEW_LIMIT);
  const hasMore = filtered.length > PREVIEW_LIMIT;

  const skeletons = Array.from({ length: PREVIEW_LIMIT });

  return (
    <section
      id='games'
      ref={sectionRef}
      className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py:16 lg:py-20'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          <LineReveal triggerRef={sectionRef} delay={0} duration={0.8}>
            <div className='h-px w-8 bg-[#00d4ff]' />
          </LineReveal>
          <TextReveal triggerRef={sectionRef} delay={0.15} duration={0.8}>
            <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
              GAME LIBRARY
            </span>
          </TextReveal>
        </div>

        {/* main title */}
        <TextReveal triggerRef={sectionRef} delay={0.25}>
          <h2 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              The Vault
            </span>
          </h2>
        </TextReveal>

        {/* description */}
        <TextReveal triggerRef={sectionRef} delay={0.55}>
          <p className='pt-2 pb-5 max-w-[80ch] text-left text-[clamp(0.78rem,2.2vw,1.125rem)] leading-[1.65] text-[#bcbcbc]'>
            {/* Every title, every setup. Filter by device and jump in. */}
            Our library spans every major genre and platform — competitive
            shooters, racing sims, sports titles, and VR experiences. Filter by
            device to find exactly what you're looking for, whether that's a
            battle royale on PC, a racing sim on our rigs, or an immersive title
            on PSVR.
          </p>
        </TextReveal>

        {/* category filters */}
        <div ref={sectionRef}>
          <CardsReveal triggerRef={sectionRef} delay={0.5} stagger={0.3}>
            <div className='relative z-10 mb-3 flex flex-wrap gap-2'>
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
          </CardsReveal>
        </div>

        {isLoading ? (
          <>
            {/* Mobile */}
            <ScrollArea className='-mx-6 px-6 sm:hidden'>
              <div
                className='grid grid-flow-col grid-rows-2 gap-3 pb-4'
                style={{ gridAutoColumns: '180px' }}
              >
                {skeletons.map((_, i) => (
                  <GameCardSkeleton key={i} />
                ))}
              </div>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>

            {/* Desktop / Tablet */}
            <div className='hidden sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
              {skeletons.map((_, i) => (
                <GameCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Mobile */}
            <ScrollArea className='-mx-6 px-6 sm:hidden'>
              <CardsReveal triggerRef={sectionRef} delay={0.95} stagger={0.3}>
                <div
                  ref={mobileCardsRef}
                  className='grid grid-flow-col grid-rows-2 gap-3 pb-4'
                  style={{ gridAutoColumns: '180px' }}
                >
                  {preview.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </CardsReveal>
              <ScrollBar orientation='horizontal' />
            </ScrollArea>

            {/* Desktop / Tablet */}
            <div ref={desktopCardsRef}>
              <CardsReveal triggerRef={desktopCardsRef} delay={1} stagger={0.3}>
                <div className='hidden sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
                  {preview.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </CardsReveal>
            </div>

            {/* View All */}
            {hasMore && (
              <LineReveal triggerRef={buttonsRef} delay={0.5}>
                <div className='mt-8 flex justify-center'>
                  <Link
                    href='/games'
                    className='rounded-md border border-cyan-400/40 px-6 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/10'
                  >
                    View all {filtered.length} games →
                  </Link>
                </div>
              </LineReveal>
            )}
          </>
        )}
      </div>
    </section>
  );
}
