'use client';
import { useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2Icon } from 'lucide-react';
import { markNoShow } from '@/app/actions/bookings';
import CountdownTicker from '../../../components/stations/CountdownTicker';
import { cn } from '@/lib/utils';

type Booking = {
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

export function StationCard({
  station,
  booking,
  pendingIds,
  onStart,
  onEnd,
  onExtend,
}: {
  station: Station;
  booking?: Booking;
  pendingIds: Set<string>;
  onStart: (booking: Booking) => void;
  onEnd: (booking: Booking) => void;
  onExtend: (booking: Booking, stationId: string, minutes: number) => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  const isActive = !!booking?.session_started_at && !booking?.session_ended_at;
  const isBooked = !!booking && !isActive;
  const isPending = booking ? pendingIds.has(booking.id) : false;

  let timeLeftMs: number | null = null;
  let totalDurationMs = 0;

  function formatOverdueTime(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `+${String(hours).padStart(2, '0')}:${String(minutes).padStart(
        2,
        '0',
      )}:${String(seconds).padStart(2, '0')}`;
    }

    return `+${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  }

  if (isActive && booking?.session_started_at) {
    const start = new Date(booking.session_started_at);
    const actualEnd = new Date(start);
    actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
    const end = booking.extended_until
      ? new Date(booking.extended_until)
      : actualEnd;

    timeLeftMs = Math.max(0, end.getTime() - now);
    totalDurationMs = end.getTime() - start.getTime();
  }

  const progressPct =
    totalDurationMs > 0 && timeLeftMs !== null
      ? Math.min(100, Math.max(0, (1 - timeLeftMs / totalDurationMs) * 100))
      : 0;

  const scheduledStartMs = booking
    ? new Date(`${booking.date}T${booking.start_time}`).getTime()
    : null;

  const minutesUntilStart =
    scheduledStartMs !== null
      ? Math.ceil((scheduledStartMs - now) / 60_000)
      : null;

  const overdueMs =
    scheduledStartMs !== null && now >= scheduledStartMs
      ? now - scheduledStartMs
      : 0;

  const overdueMinutes = Math.floor(overdueMs / 60_000);

  const canStartEarly =
    scheduledStartMs !== null && now >= scheduledStartMs - 15 * 60_000;

  const bookingStatus = !booking
    ? 'free'
    : isActive
      ? 'active'
      : overdueMinutes >= 30
        ? 'no-show'
        : overdueMinutes >= 15
          ? 'late'
          : now >= scheduledStartMs!
            ? 'due'
            : 'upcoming';

  const [selected, setSelected] = useState<number>(30);

  const options = [
    { label: '15 min', value: 15 },
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
  ];

  const finalMinutes = selected;

  const actionStyles = {
    extend:
      'border border-cyan-400/40 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20 shadow-[0_0_14px_-5px_rgba(34,211,238,0.6)]',

    end: 'bg-[#ED4646] text-black hover:bg-red-800 shadow-[0_0_18px_-4px_rgba(239,68,68,0.8)]',
  };
  const hud = {
    active: {
      shell:
        'border-cyan-400/30 bg-[#05090b] before:bg-cyan-400 shadow-[0_0_24px_-12px_rgba(34,211,238,0.7)]',
      chip: 'bg-cyan-400 text-black',
      accent: 'text-cyan-300',
      bar: 'bg-cyan-400',
      button:
        'bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_18px_-4px_rgba(34,211,238,0.9)]',
    },

    upcoming: {
      shell: 'border-[#D946EF] bg-[#0b070d] before:bg-[#D946EF]',
      chip: 'border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300',
      accent: 'text-[#D946EF]',
      bar: 'bg-[#D946EF]',
      button:
        'bg-[#D946EF] hover:bg-[#E879F9] shadow-[0_0_18px_-4px_rgba(217,70,239,0.9)]',
    },

    due: {
      shell:
        'border-amber-400/30 bg-[#0d0d0f] before:bg-amber-400 shadow-[0_0_24px_-12px_rgba(251,191,36,0.65)]',
      chip: 'bg-amber-400 text-black',
      accent: 'text-amber-300',
      bar: 'bg-amber-400',
      button:
        'bg-amber-400 hover:bg-amber-300 shadow-[0_0_18px_-4px_rgba(251,191,36,0.9)]',
    },

    late: {
      shell:
        'border-red-500/30 bg-[#0d0b0c] before:bg-red-500 shadow-[0_0_24px_-12px_rgba(239,68,68,0.65)]',
      chip: 'bg-red-500 text-white',
      accent: 'text-red-300',
      bar: 'bg-red-500',
      button:
        'bg-red-500 hover:bg-red-400 text-white shadow-[0_0_18px_-4px_rgba(239,68,68,0.9)]',
    },

    'no-show': {
      shell:
        'border-red-500/30 bg-[#0d0b0c] before:bg-red-500 shadow-[0_0_24px_-12px_rgba(239,68,68,0.65)]',
      chip: 'bg-red-500 text-white',
      accent: 'text-red-300',
      bar: 'bg-red-500',
      button:
        'bg-red-500 hover:bg-red-400 text-white shadow-[0_0_18px_-4px_rgba(239,68,68,0.9)]',
    },

    free: {
      shell: 'border-white/8 bg-[#07090c] before:bg-white/10',
      chip: 'border border-white/10 bg-white/5 text-neutral-400',
      accent: 'text-neutral-500',
      bar: 'bg-white/15',
      button: 'bg-white/10 text-white',
    },
  }[bookingStatus];
  const label = {
    active: 'ACTIVE',
    upcoming: 'UPCOMING',
    due: 'DUE',
    late: 'OVERDUE',
    'no-show': 'NO SHOW',
    booked: 'BOOKED',
    free: 'FREE',
  }[bookingStatus];

  return (
    <div
      className={`flex flex-col  relative min-w-0 overflow-hidden  border p-3 transition-all duration-300 before:absolute before:inset-y-0 before:left-0 before:w-1 before:content-[''] sm:p-3.5 ${hud.shell}`}
    >
      {/* header row — dot (free only) + name, status pill */}
      <div className='flex items-center justify-between gap-2'>
        <div className='flex min-w-0 items-center gap-1.5'>
          {!booking && (
            <span className='h-1.5 w-1.5 shrink-0 rounded-full bg-white/20' />
          )}
          <span className='truncate text-sm font-semibold tracking-wide text-neutral-100'>
            {station.name}
          </span>
          {booking?.device === 'vr' && (
            <span
              className={`shrink-0 bg-emerald-400 font-mono px-1.5 py-0.5 text-[10px] uppercase text-black`}
            >
              VR
            </span>
          )}
        </div>
        <div className='relative'>
          <span
            className={`shrink-0  px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${hud.chip}`}
          >
            {label}
          </span>
        </div>
      </div>

      {booking && (
        <>
          <div className='mt-2 flex items-baseline justify-between gap-2'>
            <div className='flex flex-1 justify-between items-center'>
              <p
                className={`min-w-0 truncate text-sm font-medium ${hud?.accent}`}
              >
                {booking.profiles?.full_name ??
                  booking.customer_name ??
                  'Guest'}
              </p>
              <span className={hud.accent}>
                {bookingStatus === 'upcoming' &&
                  minutesUntilStart !== null &&
                  (minutesUntilStart <= 60
                    ? `starts in ${minutesUntilStart} min`
                    : booking.start_time.slice(0, 5))}

                {bookingStatus === 'due' && (
                  <>
                    <span>{formatOverdueTime(overdueMs)}</span>
                  </>
                )}

                {bookingStatus === 'late' && (
                  <>
                    <span>{formatOverdueTime(overdueMs)}</span>
                  </>
                )}

                {bookingStatus === 'no-show' && (
                  <>
                    <span>{formatOverdueTime(overdueMs)}</span>
                  </>
                )}
              </span>
            </div>

            {timeLeftMs !== null && (
              <CountdownTicker
                seconds={Math.ceil(timeLeftMs / 1000)}
                danger={timeLeftMs <= 5 * 60_000}
              />
            )}
          </div>
          {/* bare progress bar, no boxed panel */}
          {timeLeftMs !== null && (
            <div className='mt-2 h-1 overflow-hidden rounded-full bg-white/8'>
              <div
                className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
                  timeLeftMs <= 5 * 60_000
                    ? 'bg-red-400 shadow-[0_0_10px_1px_rgba(248,113,113,0.9)]'
                    : hud.bar
                }`}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          )}

          {/* actions row */}
          <div
            className={cn(
              'flex min-w-0 items-center gap-2',
              bookingStatus === 'active' ? 'mt-5' : 'mt-auto pt-5',
            )}
          >
            {isBooked &&
              bookingStatus !== 'no-show' &&
              bookingStatus !== 'late' &&
              canStartEarly && (
                <Button
                  onClick={() => onStart(booking)}
                  disabled={isPending}
                  className={cn(
                    'rounded-none flex flex-1 items-center justify-center gap-1.5',
                    'px-3 py-2 font-mono text-xs uppercase tracking-[0.2em]',
                    'text-black transition-all duration-200',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    hud.button,
                  )}
                >
                  {isPending && <Loader2 className='h-3 w-3 animate-spin' />}

                  {bookingStatus === 'due' ? 'Initialize Session' : 'Start Now'}
                </Button>
              )}
            {bookingStatus === 'late' && (
              <>
                {/* Start Anyway */}
                <Button
                  onClick={() => onStart(booking)}
                  disabled={isPending}
                  className={cn(
                    'min-w-0 flex flex-1 items-center justify-center gap-1.5 rounded-none',
                    'px-2 py-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em]',
                    'whitespace-normal text-center leading-tight',
                    'text-black transition-all duration-200',
                    'disabled:cursor-not-allowed disabled:opacity-60',
                    hud.button,
                  )}
                >
                  {isPending && (
                    <Loader2 className='h-3 w-3 shrink-0 animate-spin' />
                  )}
                  Start Anyway
                </Button>

                {/* Mark No Show */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      disabled={isPending}
                      className={cn(
                        'min-w-0 flex flex-1 items-center justify-center gap-1.5 rounded-none',
                        'border border-red-500/40 bg-transparent px-2 py-2',
                        'font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em]',
                        'whitespace-normal text-center leading-tight',
                        'text-red-400 transition-all duration-200',
                        'hover:bg-red-500/10 hover:text-red-300',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                      )}
                    >
                      Mark No Show
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent size='sm'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Mark as No Show?</AlertDialogTitle>

                      <AlertDialogDescription>
                        The customer has not arrived within the grace period.
                        This booking will be marked as <strong>No Show</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel variant='ghost'>
                        Keep Booking
                      </AlertDialogCancel>

                      <AlertDialogAction
                        variant='destructive'
                        disabled={isPending}
                        onClick={() => markNoShow(booking.id)}
                      >
                        Mark No Show
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}

            {isActive && (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {/* <button className='flex-1 rounded-none border border-red-500/30 bg-red-500/10 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-red-300 transition-colors hover:bg-red-500/20'>
                      End
                    </button> */}
                    <Button
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-none',
                        'px-3 py-2 font-mono text-xs uppercase tracking-[0.2em]',
                        'transition-all duration-200',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                        actionStyles.end,
                      )}
                    >
                      End
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent size='sm'>
                    <AlertDialogHeader>
                      <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
                        <Trash2Icon />
                      </AlertDialogMedia>
                      <AlertDialogTitle>End Session?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently end the session
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel variant='ghost'>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        variant='destructive'
                        disabled={isPending}
                        onClick={async () => await onEnd(booking)}
                      >
                        End Session
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className={cn(
                        'flex flex-1 items-center justify-center gap-1.5 rounded-none',
                        'px-3 py-2 font-mono text-xs uppercase tracking-[0.2em]',
                        'transition-all duration-200',
                        'disabled:cursor-not-allowed disabled:opacity-60',
                        actionStyles.extend,
                      )}
                    >
                      Extend
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent className='w-[calc(100%-2rem)] max-w-md border-cyan-400/20 bg-[#08090b] p-5 sm:p-6'>
                    <AlertDialogHeader className='space-y-1'>
                      <AlertDialogTitle className='font-mono text-xl tracking-tight text-white'>
                        Extend session
                      </AlertDialogTitle>
                      <AlertDialogDescription className='font-mono text-xs text-cyan-100/60'>
                        Add extra time to the current session.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className='space-y-4 py-3'>
                      <div className='space-y-2'>
                        <p className='font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-white/40'>
                          Quick extension
                        </p>

                        {/* <div className='grid grid-cols-2 gap-2'>
                          {options.map((opt) => {
                            const isSelected = selected === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type='button'
                                onClick={() => setSelected(opt.value)}
                                className={`relative flex h-12 items-center justify-center rounded-lg border font-mono text-sm transition-all duration-150 ${
                                  isSelected
                                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.10)]'
                                    : 'border-white/10 bg-white/2 text-white/60 hover:border-white/20 hover:bg-white/4 hover:text-white'
                                }`}
                              >
                                {opt.label}
                                {isSelected && (
                                  <span className='absolute right-2 top-2 text-[10px] text-cyan-300'>
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          })}

                          <button
                            type='button'
                            onClick={() => setSelected(-1)}
                            className={`flex h-12 items-center justify-center rounded-lg border font-mono text-sm transition-all duration-150 ${
                              selected === -1
                                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.10)]'
                                : 'border-white/10 bg-white/2 text-white/60 hover:border-white/20 hover:bg-white/4 hover:text-white'
                            }`}
                          >
                            Custom
                          </button>
                        </div> */}
                        <div className='grid grid-cols-2 gap-2'>
                          {options.map((opt) => {
                            const isSelected = selected === opt.value;
                            return (
                              <button
                                key={opt.value}
                                type='button'
                                onClick={() => setSelected(opt.value)}
                                className={`relative flex h-12 items-center justify-center rounded-lg border font-mono text-sm transition-all duration-150 ${
                                  isSelected
                                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200 shadow-[0_0_14px_rgba(34,211,238,0.10)]'
                                    : 'border-white/10 bg-white/2 text-white/60 hover:border-white/20 hover:bg-white/4 hover:text-white'
                                }`}
                              >
                                {opt.label}
                                {isSelected && (
                                  <span className='absolute right-2 top-2 text-[10px] text-cyan-300'>
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* {selected === -1 && (
                        <div className='space-y-2'>
                          <label className='font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-white/40'>
                            Extra minutes
                          </label>
                          <div className='relative'>
                            <input
                              type='number'
                              min={1}
                              placeholder='Enter minutes'
                              value={customMinutes}
                              onChange={(e) => setCustomMinutes(e.target.value)}
                              autoFocus
                              className='h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 pr-16 font-mono text-sm text-white outline-none placeholder:text-white/25 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20'
                            />
                            <span className='pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-white/30'>
                              min
                            </span>
                          </div>
                        </div>
                      )} */}

                      {finalMinutes > 0 && (
                        <div className='flex items-center justify-between rounded-lg border border-cyan-400/10 bg-cyan-400/[0.04] px-3 py-2.5'>
                          <span className='font-mono text-xs text-white/40'>
                            Additional time
                          </span>
                          <span className='font-mono text-sm font-medium text-cyan-300'>
                            +{finalMinutes} min
                          </span>
                        </div>
                      )}
                    </div>

                    <AlertDialogFooter className='flex-row gap-2 sm:justify-end'>
                      <AlertDialogCancel
                        variant='ghost'
                        className='mt-0 flex-1 sm:flex-none'
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className='flex-1 bg-cyan-400 font-mono text-sm font-medium text-black hover:bg-cyan-300 sm:flex-none'
                        disabled={finalMinutes <= 0 || isPending}
                        onClick={() =>
                          onExtend(booking, station.id, finalMinutes)
                        }
                      >
                        {isPending && (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        Extend +{finalMinutes || 0} min
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
