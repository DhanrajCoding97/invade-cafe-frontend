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

// export function StationCard({
//   station,
//   booking,
//   pendingIds,
//   unpaidExtension,
//   onStart,
//   onEnd,
//   onExtend,
//   onMarkExtensionPaid,
// }: {
//   station: Station;
//   booking?: Booking;
//   pendingIds: Set<string>;
//   unpaidExtension?: Extension;
//   onStart: (booking: Booking) => void;
//   onEnd: (booking: Booking) => void;
//   onExtend: (booking: Booking, stationId: string, minutes: number) => void;
//   onMarkExtensionPaid: (extensionId: string) => void;
// }) {
//   const [now, setNow] = useState(() => Date.now());

//   useEffect(() => {
//     const id = setInterval(() => setNow(Date.now()), 1_000);
//     return () => clearInterval(id);
//   }, []);

//   const isActive = !!booking?.session_started_at && !booking?.session_ended_at;
//   const isBooked = !!booking && !isActive;
//   const isPending = booking ? pendingIds.has(booking.id) : false;

//   //   let timeLeft: number | null = null;
//   //   if (isActive && booking?.session_started_at) {
//   //     const actualEnd = new Date(booking.session_started_at);
//   //     actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
//   //     const end = booking.extended_until ?? actualEnd.toISOString();
//   //     timeLeft = getTimeLeft(end, now);
//   //   }
//   let timeLeftMs: number | null = null;
//   let totalDurationMs = 0;

//   if (isActive && booking?.session_started_at) {
//     const start = new Date(booking.session_started_at);
//     const actualEnd = new Date(start);
//     actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
//     const end = booking.extended_until
//       ? new Date(booking.extended_until)
//       : actualEnd;

//     timeLeftMs = Math.max(0, end.getTime() - now);
//     totalDurationMs = end.getTime() - start.getTime();
//   }
//   function formatCountdown(ms: number) {
//     const totalSeconds = Math.floor(ms / 1000);
//     const mins = Math.floor(totalSeconds / 60);
//     const secs = totalSeconds % 60;
//     return `${mins}:${secs.toString().padStart(2, '0')}`;
//   }

//   const overdueMinutes =
//     isBooked && booking
//       ? Math.max(
//           0,
//           Math.floor(
//             (now -
//               new Date(`${booking.date}T${booking.start_time}`).getTime()) /
//               60000,
//           ),
//         )
//       : 0;

//   const bookingStatus = !booking
//     ? 'free'
//     : isActive
//       ? 'active'
//       : overdueMinutes >= 30
//         ? 'no-show'
//         : overdueMinutes >= 15
//           ? 'late'
//           : overdueMinutes > 0
//             ? 'due'
//             : 'booked';

//   const [selected, setSelected] = useState<number>(30);
//   const [customMinutes, setCustomMinutes] = useState('');

//   const options = [
//     { label: '30 min', value: 30 },
//     { label: '1 hour', value: 60 },
//     { label: '2 hours', value: 120 },
//   ];

//   const finalMinutes = selected === -1 ? Number(customMinutes) || 0 : selected;

//   return (
//     <div
//       className={`rounded-xl border p-4 flex flex-col gap-2 max-h-fit ${
//         bookingStatus === 'active'
//           ? 'border-cyan-400 bg-[#060a13]'
//           : bookingStatus === 'due'
//             ? 'border-amber-400 bg-amber-400/10 animate-pulse'
//             : bookingStatus === 'late'
//               ? 'border-orange-400 bg-orange-400/10'
//               : bookingStatus === 'no-show'
//                 ? 'border-red-500 bg-red-500/10'
//                 : bookingStatus === 'booked'
//                   ? 'border-fuchsia-500/50 bg-fuchsia-500/5'
//                   : 'border-neutral-800 bg-neutral-900'
//       }`}
//     >
//       <div className='flex justify-between items-center'>
//         <span className='font-semibold text-sm flex items-center gap-1.5'>
//           {station.name}
//           {booking?.device === 'vr' && (
//             <span className='text-[9px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30'>
//               VR
//             </span>
//           )}
//         </span>
//         <span
//           className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
//             bookingStatus === 'active'
//               ? 'bg-cyan-400 text-black'
//               : bookingStatus === 'due'
//                 ? 'bg-amber-400 text-black'
//                 : bookingStatus === 'late'
//                   ? 'bg-orange-400 text-black'
//                   : bookingStatus === 'no-show'
//                     ? 'bg-red-500 text-white'
//                     : bookingStatus === 'booked'
//                       ? 'bg-fuchsia-500 text-black'
//                       : 'bg-neutral-700 text-neutral-300'
//           }`}
//         >
//           {
//             {
//               active: 'Active',
//               due: 'Due',
//               late: 'Late',
//               'no-show': 'No Show',
//               booked: 'Booked',
//               free: 'Free',
//             }[bookingStatus]
//           }
//         </span>
//       </div>

//       {booking ? (
//         <>
//           <>
//             <p className='text-sm text-neutral-300'>
//               {booking.profiles?.full_name ?? booking.customer_name ?? 'Guest'}
//             </p>
//             <p className='text-xs text-neutral-500'>
//               {bookingStatus === 'due' ||
//               bookingStatus === 'late' ||
//               bookingStatus === 'no-show'
//                 ? `${overdueMinutes} min overdue`
//                 : booking.start_time.slice(0, 5)}
//             </p>
//             {/* {timeLeft !== null && (
//               <p
//                 className={`text-xs font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-300'}`}
//               >
//                 {timeLeft} min left
//               </p>
//             )} */}
//             {timeLeftMs !== null && (
//               <CountdownTicker
//                 seconds={Math.ceil(timeLeftMs / 1000)}
//                 danger={timeLeftMs <= 5 * 60_000}
//               />
//             )}

//             <div className='flex flex-col gap-2 mt-2'>
//               {/* <p className='text-xs text-neutral-500'>
//               {isDue
//                 ? `${overdueMinutes} min overdue`
//                 : booking.start_time.slice(0, 5)}
//             </p> */}
//               <div className='flex items-center gap-2 flex-wrap'>
//                 {isBooked && (
//                   <Button
//                     onClick={() => onStart(booking)}
//                     disabled={isPending}
//                     className='flex items-center gap-1.5 bg-cyan-400 px-3 py-1.5 text-xs font-medium text-black hover:bg-cyan-300 disabled:opacity-60'
//                   >
//                     {isPending && <Loader2 className='h-3 w-3 animate-spin' />}

//                     {bookingStatus === 'booked' ? 'Start' : 'Start Now'}
//                   </Button>
//                 )}

//                 {bookingStatus === 'no-show' && (
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant='destructive'>No Show</Button>
//                     </AlertDialogTrigger>

//                     <AlertDialogContent size='sm'>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Mark as No Show?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           The customer did not arrive within the grace period.
//                           This booking will be marked as{' '}
//                           <strong>No Show</strong>. No refund will be issued.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>

//                       <AlertDialogFooter>
//                         <AlertDialogCancel variant='ghost'>
//                           Keep Booking
//                         </AlertDialogCancel>

//                         <AlertDialogAction
//                           variant='destructive'
//                           onClick={() => markNoShow(booking.id)}
//                         >
//                           Mark No Show
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 )}
//               </div>
//               {isActive && (
//                 <div className='flex flex-wrap gap-3'>
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <Button variant='destructive'>End Session</Button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent size='sm'>
//                       <AlertDialogHeader>
//                         <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
//                           <Trash2Icon />
//                         </AlertDialogMedia>
//                         <AlertDialogTitle>End Session?</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           This will permanently end the session
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>
//                       <AlertDialogFooter>
//                         <AlertDialogCancel variant='ghost'>
//                           Cancel
//                         </AlertDialogCancel>
//                         <AlertDialogAction
//                           variant='destructive'
//                           disabled={isPending}
//                           onClick={async () => await onEnd(booking)}
//                         >
//                           End Session
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                   {/* extend session */}
//                   {/* <button
//                   onClick={() => onExtend(booking, station.id)}
//                   disabled={isPending}
//                   className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-neutral-700 text-white font-medium disabled:opacity-60'
//                 >
//                   {isPending && <Loader2 className='h-3 w-3 animate-spin' />}
//                   +30m
//                 </button> */}
//                   <AlertDialog>
//                     <AlertDialogTrigger asChild>
//                       <button
//                         disabled={isPending}
//                         className='flex-1 flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-neutral-700 text-white font-medium disabled:opacity-60'
//                       >
//                         {isPending && (
//                           <Loader2 className='h-3 w-3 animate-spin' />
//                         )}
//                         Extend
//                       </button>
//                     </AlertDialogTrigger>
//                     <AlertDialogContent size='sm'>
//                       <AlertDialogHeader>
//                         <AlertDialogTitle>Extend session</AlertDialogTitle>
//                         <AlertDialogDescription>
//                           Choose how much extra time to add.
//                         </AlertDialogDescription>
//                       </AlertDialogHeader>

//                       <div className='flex flex-col gap-2 py-2'>
//                         {options.map((opt) => (
//                           <button
//                             key={opt.value}
//                             onClick={() => setSelected(opt.value)}
//                             className={`text-left px-3 py-2 rounded-md text-sm border ${
//                               selected === opt.value
//                                 ? 'border-cyan-400 bg-cyan-400/10'
//                                 : 'border-neutral-700'
//                             }`}
//                           >
//                             {opt.label}
//                           </button>
//                         ))}
//                         <button
//                           onClick={() => setSelected(-1)}
//                           className={`text-left px-3 py-2 rounded-md text-sm border ${
//                             selected === -1
//                               ? 'border-cyan-400 bg-cyan-400/10'
//                               : 'border-neutral-700'
//                           }`}
//                         >
//                           Custom
//                         </button>
//                         {selected === -1 && (
//                           <input
//                             type='number'
//                             min={1}
//                             placeholder='Minutes'
//                             value={customMinutes}
//                             onChange={(e) => setCustomMinutes(e.target.value)}
//                             className='px-3 py-2 rounded-md text-sm bg-neutral-800 border border-neutral-700'
//                           />
//                         )}
//                       </div>

//                       <AlertDialogFooter>
//                         <AlertDialogCancel variant='ghost'>
//                           Cancel
//                         </AlertDialogCancel>
//                         <AlertDialogAction
//                           className='whitespace-normal wrap-break text-center text-sm'
//                           disabled={finalMinutes <= 0}
//                           onClick={() =>
//                             onExtend(booking, station.id, finalMinutes)
//                           }
//                         >
//                           Extend by {finalMinutes || 0} min
//                         </AlertDialogAction>
//                       </AlertDialogFooter>
//                     </AlertDialogContent>
//                   </AlertDialog>
//                 </div>
//               )}
//               {unpaidExtension && (
//                 <div className='flex items-center justify-between gap-2 mt-1 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/30'>
//                   <span className='text-[11px] text-amber-300'>
//                     ₹{unpaidExtension.amount} extension unpaid
//                   </span>
//                   <button
//                     onClick={() => onMarkExtensionPaid(unpaidExtension.id)}
//                     className='text-[10px] px-2 py-0.5 rounded bg-amber-400 text-black font-medium'
//                   >
//                     Mark Paid
//                   </button>
//                 </div>
//               )}
//             </div>
//           </>

//           {/* ...rest unchanged, just pass `now` into getTimeLeft calls if any others exist... */}
//         </>
//       ) : (
//         <p className='text-xs text-neutral-500'>No booking</p>
//       )}
//     </div>
//   );
// }

// function getTimeLeft(endIso: string, now: number) {
//   return Math.max(0, Math.round((new Date(endIso).getTime() - now) / 60_000));
// }

export function StationCard({
  station,
  booking,
  pendingIds,
  // unpaidExtension,
  onStart,
  onEnd,
  onExtend,
  // onMarkExtensionPaid,
}: {
  station: Station;
  booking?: Booking;
  pendingIds: Set<string>;
  // unpaidExtension?: Extension;
  onStart: (booking: Booking) => void;
  onEnd: (booking: Booking) => void;
  onExtend: (booking: Booking, stationId: string, minutes: number) => void;
  // onMarkExtensionPaid: (extensionId: string) => void;
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

  const hud = {
    active: {
      shell:
        'border-cyan-400/60 bg-[#04080f] shadow-[0_0_0_1px_rgba(34,211,238,0.15),0_0_28px_-8px_rgba(34,211,238,0.55)]',
      rail: 'bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.8)]',
      chip: 'bg-cyan-400 text-black shadow-[0_0_14px_-2px_rgba(34,211,238,0.9)]',
      accent: 'text-cyan-300',
    },
    due: {
      shell:
        'border-amber-400/60 bg-[#0d0902] shadow-[0_0_28px_-10px_rgba(251,191,36,0.6)]',
      rail: 'bg-amber-400 shadow-[0_0_12px_2px_rgba(251,191,36,0.8)] animate-pulse',
      chip: 'bg-amber-400 text-black',
      accent: 'text-amber-300',
    },
    late: {
      shell: 'border-orange-400/60 bg-[#0d0702]',
      rail: 'bg-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.8)]',
      chip: 'bg-orange-400 text-black',
      accent: 'text-orange-300',
    },
    'no-show': {
      shell: 'border-red-500/60 bg-[#0d0304]',
      rail: 'bg-red-500 shadow-[0_0_12px_2px_rgba(239,68,68,0.8)]',
      chip: 'bg-red-500 text-white',
      accent: 'text-red-300',
    },
    booked: {
      shell: 'border-fuchsia-500/45 bg-[#0a040d]',
      rail: 'bg-fuchsia-500 shadow-[0_0_12px_2px_rgba(217,70,239,0.7)]',
      chip: 'bg-fuchsia-500 text-black',
      accent: 'text-fuchsia-300',
    },
    free: {
      shell: 'border-white/8 bg-[#07090c]',
      rail: 'bg-white/15',
      chip: 'bg-white/8 text-neutral-400 border border-white/10',
      accent: 'text-neutral-500',
    },
  }[bookingStatus];

  const label = {
    active: 'Active',
    due: 'Due',
    late: 'Late',
    'no-show': 'No Show',
    booked: 'Booked',
    free: 'Free',
  }[bookingStatus];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-px transition-all duration-300 ${hud.shell}`}
    >
      {/* left status rail */}
      <span className={`absolute left-0 top-0 h-full w-0.75 ${hud.rail}`} />
      {/* corner ticks */}
      <span className='pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-white/15' />
      <span className='pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-white/15' />

      <div className='relative flex flex-col gap-3 rounded-2xl p-4'>
        {/* header */}
        <div className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2'>
          <div className='flex min-w-0 items-center gap-1.5'>
            <span className='truncate text-sm font-semibold tracking-wide text-neutral-100'>
              {station.name}
            </span>
            {booking?.device === 'vr' && (
              <span className='shrink-0 rounded-full border border-purple-500/30 bg-purple-500/20 px-1.5 py-0.5 font-mono text-[9px] uppercase text-purple-300'>
                VR
              </span>
            )}
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${hud.chip}`}
          >
            {label}
          </span>
        </div>

        {booking ? (
          <>
            {/* identity block */}
            <div className='min-w-0 space-y-0.5 border-l border-white/10 pl-2.5'>
              <p className='truncate text-sm text-neutral-200'>
                {booking.profiles?.full_name ??
                  booking.customer_name ??
                  'Guest'}
              </p>
              <p
                className={`font-mono text-[11px] uppercase tracking-wider ${hud.accent}`}
              >
                {bookingStatus === 'due' ||
                bookingStatus === 'late' ||
                bookingStatus === 'no-show'
                  ? `${overdueMinutes} min overdue`
                  : booking.start_time.slice(0, 5)}
              </p>
            </div>

            {/* countdown HUD */}
            {timeLeftMs !== null && (
              <div className='rounded-xl border border-white/8 bg-black/50 px-3 py-2'>
                <div className='flex items-baseline justify-between gap-2'>
                  <span className='font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-500'>
                    Remaining
                  </span>
                  <CountdownTicker
                    seconds={Math.ceil(timeLeftMs / 1000)}
                    danger={timeLeftMs <= 5 * 60_000}
                  />
                </div>
                <div className='mt-2 h-1 overflow-hidden rounded-full bg-white/8'>
                  <div
                    className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
                      timeLeftMs <= 5 * 60_000
                        ? 'bg-red-400 shadow-[0_0_10px_1px_rgba(248,113,113,0.9)]'
                        : 'bg-cyan-400 shadow-[0_0_10px_1px_rgba(34,211,238,0.9)]'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            <div className='mt-1 flex flex-col gap-2'>
              <div className='flex flex-wrap items-center gap-2'>
                {isBooked && (
                  <Button
                    onClick={() => onStart(booking)}
                    disabled={isPending}
                    className='flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-cyan-400 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-black shadow-[0_0_18px_-4px_rgba(34,211,238,0.9)] hover:bg-cyan-300 disabled:opacity-60'
                  >
                    {isPending && <Loader2 className='h-3 w-3 animate-spin' />}
                    {bookingStatus === 'booked' ? 'Start' : 'Start Now'}
                  </Button>
                )}

                {bookingStatus === 'no-show' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='destructive'
                        className='flex-1 rounded-lg font-mono text-xs uppercase tracking-wider'
                      >
                        No Show
                      </Button>
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
                <div className='grid grid-cols-2 gap-2'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant='destructive'
                        className='w-full rounded-lg font-mono text-[11px] uppercase tracking-wider'
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
                      <button
                        disabled={isPending}
                        className='flex w-full items-center justify-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-60'
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
                            className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                              selected === opt.value
                                ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200'
                                : 'border-white/10 text-neutral-300 hover:border-white/20'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                        <button
                          onClick={() => setSelected(-1)}
                          className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                            selected === -1
                              ? 'border-cyan-400 bg-cyan-400/10 text-cyan-200'
                              : 'border-white/10 text-neutral-300 hover:border-white/20'
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
                            className='rounded-lg border border-white/10 bg-black/60 px-3 py-2 font-mono text-sm outline-none focus:border-cyan-400/60'
                          />
                        )}
                      </div>

                      <AlertDialogFooter>
                        <AlertDialogCancel variant='ghost'>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className='wrap-break whitespace-normal text-center text-sm'
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

              {/* {unpaidExtension && (
                <div className='flex items-center justify-between gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1.5'>
                  <span className='font-mono text-[10px] uppercase tracking-wider text-amber-300'>
                    ₹{unpaidExtension.amount} unpaid
                  </span>
                  <button
                    onClick={() => onMarkExtensionPaid(unpaidExtension.id)}
                    className='rounded bg-amber-400 px-2 py-0.5 font-mono text-[10px] font-medium uppercase text-black'
                  >
                    Mark Paid
                  </button>
                </div>
              )} */}
            </div>
          </>
        ) : (
          <div className='flex min-h-23 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-white/8 bg-black/30'>
            <span className='font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-600'>
              Idle
            </span>
            <span className='text-[11px] text-neutral-600'>No booking</span>
          </div>
        )}
      </div>
    </div>
  );
}
