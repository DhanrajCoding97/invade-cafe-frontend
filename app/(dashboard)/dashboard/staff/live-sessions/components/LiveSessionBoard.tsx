'use client';

import { useDueSessions } from '@/hooks/use-due-session';
import { useMarkExtensionPaid } from '@/hooks/use-booking-mutations';
import { Extension } from '@/types';
import { StationCard } from './StationCard';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  startSession,
  endSession,
  extendSession,
} from '../../actions/booking-action';
import { toast } from 'sonner';
import { PushNotificationToggle } from './PushNotificationToggle';
import { cn } from '@/lib/utils';
import { useRealtimeSessionBoard } from '@/hooks/use-realtime-session-board';

function getTimeLeft(endIso: string) {
  return Math.max(
    0,
    Math.round((new Date(endIso).getTime() - Date.now()) / 60_000),
  );
}
export type Booking = {
  id: string;
  station_id: string;
  date: string;
  start_time: string;
  duration_hours: string | number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  session_started_at: string | null;
  session_ended_at: string | null;
  extended_until: string | null;
  customer_name: string | null;
  device: string;
  profiles: { full_name: string } | null;
};

type Station = { id: string; name: string; type: string };

const STATION_TYPES = [
  { key: 'pc', label: 'PC' },
  { key: 'ps5', label: 'PS5' },
  { key: 'racing', label: 'Racing Sim' },
] as const;

type TabKey = StationType | 'all';

type StationType = (typeof STATION_TYPES)[number]['key'];

export default function LiveSessionBoard({
  stations,
  initialBookings,
  initialExtensions,
}: {
  stations: Station[];
  initialBookings: Booking[];
  initialExtensions: Extension[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [activeType, setActiveType] = useState<StationType>('pc');
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [audioUnlocked, setAudioUnlocked] = useState<boolean | null>(null);

  const supabase = createClient();
  const markExtensionPaid = useMarkExtensionPaid();

  const AUDIO_UNLOCKED_KEY = 'live-session-audio-unlocked';
  useRealtimeSessionBoard(setBookings);

  useDueSessions(bookings);

  const { data: extensions = initialExtensions } = useQuery({
    queryKey: ['session-extensions'],
    queryFn: async () => {
      const { data } = await supabase
        .from('session_extensions')
        .select('*')
        .eq('payment_status', 'pending');
      return data ?? [];
    },
    initialData: initialExtensions,
  });

  function unlockAudio() {
    const audio = new Audio('/sounds/notification-audio.mp3');
    audio.volume = 0;

    audio
      .play()
      .then(() => {
        audio.pause();
        audio.currentTime = 0;
        setAudioUnlocked(true);
        localStorage.setItem(AUDIO_UNLOCKED_KEY, 'true');
      })
      .catch(() => {
        // Audio wasn't unlocked.
      });
  }

  const unpaidExtensionFor = (bookingId: string) =>
    extensions.find(
      (e) => e.booking_id === bookingId && e.payment_status === 'pending',
    );
  function addPending(id: string) {
    setPendingIds((prev) => new Set(prev).add(id));
  }
  function removePending(id: string) {
    setPendingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }
  function handleStart(booking: Booking) {
    addPending(booking.id);
    const promise = startSession(booking.id).finally(() =>
      removePending(booking.id),
    );
    toast.promise(promise, {
      loading: 'Starting session…',
      success: 'Session started',
      error: (err) =>
        err instanceof Error ? err.message : 'Failed to start session',
    });
  }

  async function handleEnd(booking: Booking) {
    addPending(booking.id);

    try {
      await toast.promise(endSession(booking.id), {
        loading: 'Ending session...',
        success: 'Session ended',
        error: (err) =>
          err instanceof Error ? err.message : 'Failed to end session',
      });
    } finally {
      removePending(booking.id);
    }
  }

  function handleExtend(booking: Booking, stationId: string, minutes: number) {
    addPending(booking.id);
    const promise = extendSession(booking.id, stationId, minutes)
      .then((res) => {
        if (!res.ok) throw new Error(res.reason);
        return res;
      })
      .finally(() => removePending(booking.id));

    toast.promise(promise, {
      loading: 'Extending session…',
      success: (res: any) =>
        `Extended by ${minutes} min — ₹${res.amountDue} due`,
      error: (err) =>
        err instanceof Error ? err.message : 'Failed to extend session',
    });
  }

  useEffect(() => {
    const unlocked = localStorage.getItem(AUDIO_UNLOCKED_KEY) === 'true';

    if (unlocked) {
      setAudioUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const currentBookingFor = (stationId: string) =>
    bookings
      .filter((b) => b.station_id === stationId && b.status === 'confirmed')
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

  const groupedStations = STATION_TYPES.map(({ key, label }) => ({
    key,
    label,
    stations: stations.filter((s) => s.type === key),
  }));

  const isActive = (station: Station) => {
    const b = currentBookingFor(station.id);
    return !!b?.session_started_at && !b?.session_ended_at;
  };

  const isOverdue = (station: Station) => {
    const booking = currentBookingFor(station.id);

    if (!booking) return false;

    // Already started
    if (booking.session_started_at) return false;

    // Only confirmed bookings
    if (booking.status !== 'confirmed') return false;

    const start = new Date(`${booking.date}T${booking.start_time}`);
    const overdueMs = Date.now() - start.getTime();

    return overdueMs >= 15 * 60 * 1000;
  };

  const isDue = (station: Station) => {
    const booking = currentBookingFor(station.id);

    if (!booking) return false;

    if (booking.session_started_at) return false;

    if (booking.status !== 'confirmed') return false;

    const start = new Date(`${booking.date}T${booking.start_time}`);
    const now = Date.now();
    const overdueMs = now - start.getTime();

    return overdueMs >= 0 && overdueMs < 15 * 60 * 1000;
  };

  const activeCountFor = (type: StationType) =>
    stations.filter((s) => s.type === type).filter(isActive).length;

  const totalActive = stations.filter(isActive).length;
  const totalDue = stations.filter(isDue).length;
  const totalOverdue = stations.filter(isOverdue).length;
  const hasLiveCounts = totalActive > 0 || totalDue > 0 || totalOverdue > 0;

  // Stations for the currently selected tab ('all' = every station).
  const stationsForTab = (tab: TabKey) =>
    tab === 'all' ? stations : stations.filter((s) => s.type === tab);

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'All' },
    ...STATION_TYPES,
  ];

  return (
    <>
      {audioUnlocked === false && (
        <div
          className={cn(
            'sticky top-0 z-40 mb-6',
            'flex w-full min-w-0 max-w-full',
            'flex-col items-stretch gap-3',
            'border border-amber-400/30',
            'bg-[#0d0d0f]/95',
            'px-3 py-3',
            'shadow-[0_0_24px_-8px_rgba(251,191,36,0.45)]',
            'backdrop-blur-md',
            'xs:flex-row xs:items-center xs:justify-between xs:gap-4 xs:px-4',
          )}
        >
          {/* Icon + text */}
          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex size-8 shrink-0 items-center justify-center border border-amber-400/30 bg-amber-400/10'>
              <span className='text-sm'>🔊</span>
            </div>

            <div className='min-w-0 flex-1'>
              <p className='font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-amber-300 xs:text-xs xs:tracking-[0.15em]'>
                Sound Alerts Disabled
              </p>

              <p className='mt-0.5 text-[10px] leading-tight text-neutral-500 xs:text-[11px]'>
                Enable sound to hear due and overdue session alerts.
              </p>
            </div>
          </div>

          {/* Button */}
          <button
            onClick={unlockAudio}
            className={cn(
              'w-full shrink-0',
              'border border-amber-400/40',
              'bg-amber-400/10',
              'px-3 py-2',
              'font-mono text-[10px] uppercase tracking-[0.12em]',
              'text-amber-300',
              'transition hover:bg-amber-400/20',
              'xs:w-auto xs:px-3 xs:tracking-[0.15em]',
            )}
          >
            Enable Sound
          </button>
        </div>
      )}
      <div className='flex flex-col md:flex-row flex-wrap items-start justify-between gap-3 min-w-0'>
        <div className='flex flex-col md:flex-row items-start md:items-center gap-2 min-w-0'>
          <div className='flex items-center gap-2'>
            <div className='flex size-8 shrink-0 items-center justify-center border border-[#28F1FF]/40'>
              <div className='size-3 animate-pulse bg-green-400' />
            </div>

            <h2 className='text-[clamp(1.25rem,1rem+1.2vw,2.5rem)] font-extrabold whitespace-nowrap'>
              <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
                Live Session Terminal
              </span>
            </h2>
          </div>

          {hasLiveCounts ? (
            <div className='flex flex-wrap items-center gap-2 md:self-center'>
              {totalActive > 0 && (
                <div className='flex items-center gap-2 border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5'>
                  <span className='font-mono text-xs font-semibold text-cyan-400'>
                    {String(totalActive).padStart(2, '0')}
                  </span>
                  <span className='font-mono text-[10px] uppercase tracking-wider text-neutral-500'>
                    Active
                  </span>
                </div>
              )}

              {totalDue > 0 && (
                <div className='flex items-center gap-2 border border-amber-400/20 bg-amber-400/5 px-3 py-1.5'>
                  <span className='font-mono text-xs font-semibold text-amber-400'>
                    {String(totalDue).padStart(2, '0')}
                  </span>
                  <span className='font-mono text-[10px] uppercase tracking-wider text-neutral-500'>
                    Due
                  </span>
                </div>
              )}

              {totalOverdue > 0 && (
                <div className='flex items-center gap-2 border border-orange-400/20 bg-orange-400/5 px-3 py-1.5'>
                  <span className='font-mono text-xs font-semibold text-orange-400'>
                    {String(totalOverdue).padStart(2, '0')}
                  </span>
                  <span className='font-mono text-[10px] uppercase tracking-wider text-neutral-500'>
                    Overdue
                  </span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        <div className='shrink-0'>
          <PushNotificationToggle />
        </div>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as TabKey)}
        className='mt-6 w-full'
      >
        <TabsList className='rounded-none flex h-auto justify-start gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap bg-transparent p-0'>
          {tabs.map(({ key, label }) => {
            const count = key === 'all' ? totalActive : activeCountFor(key);
            return (
              <TabsTrigger
                key={key}
                value={key}
                className='rounded-none flex shrink-0 items-center gap-2  border border-white/10 bg-white/5 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-neutral-400 data-[state=active]:border-cyan-400 data-[state=active]:bg-cyan-400 data-[state=active]:text-black data-[state=active]:shadow-[0_0_18px_-4px_rgba(34,211,238,0.9)]'
              >
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map(({ key }) => {
          const tabStations = stationsForTab(key);
          const occupied = tabStations.filter((s) => currentBookingFor(s.id));
          const free = tabStations.filter((s) => !currentBookingFor(s.id));

          return (
            <TabsContent key={key} value={key} className='mt-6 min-w-0'>
              {occupied.length > 0 && (
                <section className='mb-8'>
                  <div className='mb-3 flex items-center gap-3'>
                    <h3 className='font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-fuchsia-400'>
                      Section_01 // High Priority
                    </h3>
                    <span className='h-px flex-1 bg-linear-to-r from-fuchsia-500/40 to-transparent' />
                  </div>

                  <div className='grid min-w-0 grid-cols-[repeat(auto-fill,minmax(320px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-3 sm:gap-4'>
                    {occupied.map((station) => (
                      <StationCard
                        key={station.id}
                        station={station}
                        booking={currentBookingFor(station.id)}
                        pendingIds={pendingIds}
                        onStart={handleStart}
                        onEnd={handleEnd}
                        onExtend={handleExtend}
                      />
                    ))}
                  </div>
                </section>
              )}

              {free.length > 0 && (
                <section>
                  <div className='mb-3 flex items-center gap-3'>
                    <h3 className='font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/70'>
                      Section_02 // Idle Stations
                    </h3>
                    <span className='h-px flex-1 bg-linear-to-r from-cyan-500/30 to-transparent' />
                  </div>

                  <div className='grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-4'>
                    {free.map((station) => (
                      <StationCard
                        key={station.id}
                        station={station}
                        booking={undefined}
                        pendingIds={pendingIds}
                        onStart={handleStart}
                        onEnd={handleEnd}
                        onExtend={handleExtend}
                      />
                    ))}
                  </div>
                </section>
              )}

              {occupied.length === 0 && free.length === 0 && (
                <p className='py-12 text-center font-mono text-xs text-neutral-500'>
                  No stations in this category.
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </>
  );
}
