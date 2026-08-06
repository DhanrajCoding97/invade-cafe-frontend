'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  startSession,
  endSession,
  extendSession,
} from '../../actions/booking-action';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
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
import { Trash2Icon } from 'lucide-react';
import { useDueSessions } from '@/hooks/use-due-session';
import { isSessionDue, minutesOverdue } from '@/lib/helpers/session-due';
import { markNoShow } from '@/app/actions/bookings';
import { Extension } from '@/types';
import CountdownTicker from '../../../components/stations/CountdownTicker';
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
  unpaidExtension,
  onStart,
  onEnd,
  onExtend,
  onMarkExtensionPaid,
}: {
  station: Station;
  booking?: Booking;
  pendingIds: Set<string>;
  unpaidExtension?: Extension;
  onStart: (booking: Booking) => void;
  onEnd: (booking: Booking) => void;
  onExtend: (booking: Booking, stationId: string, minutes: number) => void;
  onMarkExtensionPaid: (extensionId: string) => void;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1_000);
    return () => clearInterval(id);
  }, []);

  const isActive = !!booking?.session_started_at && !booking?.session_ended_at;
  const isBooked = !!booking && !isActive;
  const isPending = booking ? pendingIds.has(booking.id) : false;

  //   let timeLeft: number | null = null;
  //   if (isActive && booking?.session_started_at) {
  //     const actualEnd = new Date(booking.session_started_at);
  //     actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
  //     const end = booking.extended_until ?? actualEnd.toISOString();
  //     timeLeft = getTimeLeft(end, now);
  //   }
  let timeLeftMs: number | null = null;
  let totalDurationMs = 0;

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
  function formatCountdown(ms: number) {
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  const overdueMinutes =
    isBooked && booking
      ? Math.max(
          0,
          Math.floor(
            (now -
              new Date(`${booking.date}T${booking.start_time}`).getTime()) /
              60000,
          ),
        )
      : 0;

  const bookingStatus = !booking
    ? 'free'
    : isActive
      ? 'active'
      : overdueMinutes >= 30
        ? 'no-show'
        : overdueMinutes >= 15
          ? 'late'
          : overdueMinutes > 0
            ? 'due'
            : 'booked';

  const [selected, setSelected] = useState<number>(30);
  const [customMinutes, setCustomMinutes] = useState('');

  const options = [
    { label: '30 min', value: 30 },
    { label: '1 hour', value: 60 },
    { label: '2 hours', value: 120 },
  ];

  const finalMinutes = selected === -1 ? Number(customMinutes) || 0 : selected;

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-2 max-h-fit ${
        bookingStatus === 'active'
          ? 'border-cyan-400 bg-[#060a13]'
          : bookingStatus === 'due'
            ? 'border-amber-400 bg-amber-400/10 animate-pulse'
            : bookingStatus === 'late'
              ? 'border-orange-400 bg-orange-400/10'
              : bookingStatus === 'no-show'
                ? 'border-red-500 bg-red-500/10'
                : bookingStatus === 'booked'
                  ? 'border-fuchsia-500/50 bg-fuchsia-500/5'
                  : 'border-neutral-800 bg-neutral-900'
      }`}
    >
      <div className='flex justify-between items-center'>
        <span className='font-semibold text-sm flex items-center gap-1.5'>
          {station.name}
          {booking?.device === 'vr' && (
            <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30'>
              VR
            </span>
          )}
        </span>
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
            bookingStatus === 'active'
              ? 'bg-cyan-400 text-black'
              : bookingStatus === 'due'
                ? 'bg-amber-400 text-black'
                : bookingStatus === 'late'
                  ? 'bg-orange-400 text-black'
                  : bookingStatus === 'no-show'
                    ? 'bg-red-500 text-white'
                    : bookingStatus === 'booked'
                      ? 'bg-fuchsia-500 text-black'
                      : 'bg-neutral-700 text-neutral-300'
          }`}
        >
          {
            {
              active: 'Active',
              due: 'Due',
              late: 'Late',
              'no-show': 'No Show',
              booked: 'Booked',
              free: 'Free',
            }[bookingStatus]
          }
        </span>
      </div>

      {booking ? (
        <>
          <>
            <p className='text-sm text-neutral-300'>
              {booking.profiles?.full_name ?? booking.customer_name ?? 'Guest'}
            </p>
            <p className='text-xs text-neutral-500'>
              {bookingStatus === 'due' ||
              bookingStatus === 'late' ||
              bookingStatus === 'no-show'
                ? `${overdueMinutes} min overdue`
                : booking.start_time.slice(0, 5)}
            </p>
            {/* {timeLeft !== null && (
              <p
                className={`text-xs font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-300'}`}
              >
                {timeLeft} min left
              </p>
            )} */}
            {timeLeftMs !== null && (
              <CountdownTicker
                seconds={Math.ceil(timeLeftMs / 1000)}
                danger={timeLeftMs <= 5 * 60_000}
              />
            )}

            <div className='flex flex-col gap-2 mt-2'>
              {/* <p className='text-xs text-neutral-500'>
              {isDue
                ? `${overdueMinutes} min overdue`
                : booking.start_time.slice(0, 5)}
            </p> */}
              <div className='flex items-center gap-2 flex-wrap'>
                {isBooked && (
                  <Button
                    onClick={() => onStart(booking)}
                    disabled={isPending}
                    className='flex items-center gap-1.5 bg-cyan-400 px-3 py-1.5 text-xs font-medium text-black hover:bg-cyan-300 disabled:opacity-60'
                  >
                    {isPending && <Loader2 className='h-3 w-3 animate-spin' />}

                    {bookingStatus === 'booked' ? 'Start' : 'Start Now'}
                  </Button>
                )}

                {bookingStatus === 'no-show' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive'>No Show</Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent size='sm'>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Mark as No Show?</AlertDialogTitle>
                        <AlertDialogDescription>
                          The customer did not arrive within the grace period.
                          This booking will be marked as{' '}
                          <strong>No Show</strong>. No refund will be issued.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel variant='ghost'>
                          Keep Booking
                        </AlertDialogCancel>

                        <AlertDialogAction
                          variant='destructive'
                          onClick={() => markNoShow(booking.id)}
                        >
                          Mark No Show
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
              {isActive && (
                <div className='flex flex-wrap gap-3'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant='destructive'>End Session</Button>
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
                  {/* extend session */}
                  {/* <button
                  onClick={() => onExtend(booking, station.id)}
                  disabled={isPending}
                  className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-neutral-700 text-white font-medium disabled:opacity-60'
                >
                  {isPending && <Loader2 className='h-3 w-3 animate-spin' />}
                  +30m
                </button> */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        disabled={isPending}
                        className='flex-1 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-neutral-700 text-white font-medium disabled:opacity-60'
                      >
                        {isPending && (
                          <Loader2 className='h-3 w-3 animate-spin' />
                        )}
                        Extend
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size='sm'>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Extend session</AlertDialogTitle>
                        <AlertDialogDescription>
                          Choose how much extra time to add.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className='flex flex-col gap-2 py-2'>
                        {options.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => setSelected(opt.value)}
                            className={`text-left px-3 py-2 rounded-md text-sm border ${
                              selected === opt.value
                                ? 'border-cyan-400 bg-cyan-400/10'
                                : 'border-neutral-700'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setSelected(-1)}
                          className={`text-left px-3 py-2 rounded-md text-sm border ${
                            selected === -1
                              ? 'border-cyan-400 bg-cyan-400/10'
                              : 'border-neutral-700'
                          }`}
                        >
                          Custom
                        </button>
                        {selected === -1 && (
                          <input
                            type='number'
                            min={1}
                            placeholder='Minutes'
                            value={customMinutes}
                            onChange={(e) => setCustomMinutes(e.target.value)}
                            className='px-3 py-2 rounded-md text-sm bg-neutral-800 border border-neutral-700'
                          />
                        )}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel variant='ghost'>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className='whitespace-normal wrap-break text-center text-sm'
                          disabled={finalMinutes <= 0}
                          onClick={() =>
                            onExtend(booking, station.id, finalMinutes)
                          }
                        >
                          Extend by {finalMinutes || 0} min
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
              {unpaidExtension && (
                <div className='flex items-center justify-between gap-2 mt-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30'>
                  <span className='text-[11px] text-amber-300'>
                    ₹{unpaidExtension.amount} extension unpaid
                  </span>
                  <button
                    onClick={() => onMarkExtensionPaid(unpaidExtension.id)}
                    className='text-[10px] px-2 py-0.5 rounded bg-amber-400 text-black font-medium'
                  >
                    Mark Paid
                  </button>
                </div>
              )}
            </div>
          </>

          {/* ...rest unchanged, just pass `now` into getTimeLeft calls if any others exist... */}
        </>
      ) : (
        <p className='text-xs text-neutral-500'>No booking</p>
      )}
    </div>
  );
}

function getTimeLeft(endIso: string, now: number) {
  return Math.max(0, Math.round((new Date(endIso).getTime() - now) / 60_000));
}
