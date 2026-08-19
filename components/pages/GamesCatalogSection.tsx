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
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import gsap from 'gsap';

// gsap.registerPlugin(ScrollTrigger);

export default function GamesCatalogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef(null);
  const cardsRef = useRef(null);
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

  // useEffect(() => {
  //   if (!isLoading) {
  //     // let the DOM paint the real cards first, then recalc trigger positions
  //     requestAnimationFrame(() => ScrollTrigger.refresh());
  //   }
  // }, [isLoading]);
  return (
    <section
      ref={sectionRef}
      className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py:16 lg:py-20 bg-black'
    >
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* sub title */}
        <div className='my-4 flex items-center gap-4'>
          {/* <LineReveal triggerRef={sectionRef} delay={0}>
          </LineReveal> */}
          <div className='h-px w-8 bg-[#00d4ff]' />
          {/* <TextReveal triggerRef={sectionRef} delay={0.15}>
          </TextReveal> */}
          <span className='text-[10px] leading-3.75 text-[#00d4ff]'>
            GAME LIBRARY
          </span>
        </div>

        {/* main title */}
        {/* <TextReveal triggerRef={sectionRef} delay={0.25}>
        </TextReveal> */}
        <h2 className='text-[clamp(2.5rem,.7174rem+3.913vw,3.75rem)] font-extrabold'>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            The Vault
          </span>
        </h2>

        {/* description */}
        {/* <TextReveal triggerRef={sectionRef} delay={0.55}>
        </TextReveal> */}
        <p className='py-2 max-w-[80ch] text-left text-[clamp(0.78rem,2.2vw,1.125rem)] leading-[1.65] text-[#bcbcbc]'>
          {/* Every title, every setup. Filter by device and jump in. */}
          Our library spans every major genre and platform — competitive
          shooters, racing sims, sports titles, and VR experiences. Filter by
          device to find exactly what you're looking for, whether that's a
          battle royale on PC, a racing sim on our rigs, or an immersive title
          on PSVR.
        </p>

        {/* category filters */}
        <div ref={buttonsRef}>
          {/* <CardsReveal triggerRef={buttonsRef} delay={0.0} stagger={0.1}>
          </CardsReveal> */}
          <div className='relative z-10 mb-8 flex flex-wrap gap-2'>
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
              {/* <CardsReveal triggerRef={sectionRef} delay={0.85} stagger={0.3}>
              </CardsReveal> */}
              <div
                ref={cardsRef}
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
            <div ref={cardsRef}>
              {/* <CardsReveal triggerRef={cardsRef} delay={0.3} stagger={0.3}>
              </CardsReveal> */}
              <div className='hidden sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
                {preview.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </div>

            {/* View All */}
            {hasMore && (
              // <LineReveal triggerRef={sectionRef} delay={0.95}>
              // </LineReveal>
              <div className='mt-8 flex justify-center'>
                <Link
                  href='/games'
                  className='rounded-md border border-cyan-400/40 px-6 py-2 text-sm font-medium text-cyan-400 transition-colors hover:bg-cyan-400/10'
                >
                  View all {filtered.length} games →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
