'use client';
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
import { isSessionDue, minutesOverdue } from '@/lib/helpers/session-due';
import { markNoShow } from '@/app/actions/bookings';
import { useDueSessions } from '@/hooks/use-due-session';
import { useMarkExtensionPaid } from '@/hooks/use-booking-mutations';
import { Extension } from '@/types';
import { StationCard } from './StationCard';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  startSession,
  endSession,
  extendSession,
} from '../../actions/booking-action';
import { toast } from 'sonner';
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

// function StationCard({
//   station,
//   booking,
//   pendingIds,
//   onStart,
//   onEnd,
//   onExtend,
// }: {
//   station: Station;
//   booking?: Booking;
//   pendingIds: Set<string>;
//   onStart: (booking: Booking) => void;
//   onEnd: (booking: Booking) => void;
//   onExtend: (booking: Booking, stationId: string, minutes: number) => void;
// }) {
//   const isActive = !!booking?.session_started_at && !booking?.session_ended_at;
//   const isBooked = !!booking && !isActive;
//   const isPending = booking ? pendingIds.has(booking.id) : false;

//   let timeLeft: number | null = null;
//   if (isActive && booking?.session_started_at) {
//     const actualEnd = new Date(booking.session_started_at);
//     actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
//     const end = booking.extended_until ?? actualEnd.toISOString();
//     timeLeft = getTimeLeft(end);
//   }

//   const isDue = isBooked && !!booking && isSessionDue(booking); // reuse the same check from useDueSessions
//   const overdueMinutes =
//     isBooked && booking
//       ? Math.max(
//           0,
//           Math.floor(
//             (Date.now() -
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
//           ? 'border-cyan-400 bg-cyan-400/10'
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
//           <p className='text-sm text-neutral-300'>
//             {booking.profiles?.full_name ?? booking.customer_name ?? 'Guest'}
//           </p>
//           <p className='text-xs text-neutral-500'>
//             {bookingStatus === 'due' ||
//             bookingStatus === 'late' ||
//             bookingStatus === 'no-show'
//               ? `${overdueMinutes} min overdue`
//               : booking.start_time.slice(0, 5)}
//           </p>
//           {timeLeft !== null && (
//             <p
//               className={`text-xs font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-300'}`}
//             >
//               {timeLeft} min left
//             </p>
//           )}

//           <div className='flex flex-col gap-2 mt-2'>
//             {/* <p className='text-xs text-neutral-500'>
//               {isDue
//                 ? `${overdueMinutes} min overdue`
//                 : booking.start_time.slice(0, 5)}
//             </p> */}
//             <div className='flex items-center gap-2 flex-wrap'>
//               {isBooked && (
//                 <Button
//                   onClick={() => onStart(booking)}
//                   disabled={isPending}
//                   className='flex items-center gap-1.5 bg-cyan-400 px-3 py-1.5 text-xs font-medium text-black hover:bg-cyan-300 disabled:opacity-60'
//                 >
//                   {isPending && <Loader2 className='h-3 w-3 animate-spin' />}

//                   {bookingStatus === 'booked' ? 'Start' : 'Start Now'}
//                 </Button>
//               )}

//               {bookingStatus === 'no-show' && (
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant='destructive'>No Show</Button>
//                   </AlertDialogTrigger>

//                   <AlertDialogContent size='sm'>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Mark as No Show?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         The customer did not arrive within the grace period.
//                         This booking will be marked as <strong>No Show</strong>.
//                         No refund will be issued.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>

//                     <AlertDialogFooter>
//                       <AlertDialogCancel variant='ghost'>
//                         Keep Booking
//                       </AlertDialogCancel>

//                       <AlertDialogAction
//                         variant='destructive'
//                         onClick={() => markNoShow(booking.id)}
//                       >
//                         Mark No Show
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               )}
//             </div>
//             {isActive && (
//               <div className='flex gap-3'>
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <Button variant='destructive'>End Session</Button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent size='sm'>
//                     <AlertDialogHeader>
//                       <AlertDialogMedia className='bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive'>
//                         <Trash2Icon />
//                       </AlertDialogMedia>
//                       <AlertDialogTitle>End Session?</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         This will permanently end the session
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>
//                     <AlertDialogFooter>
//                       <AlertDialogCancel variant='ghost'>
//                         Cancel
//                       </AlertDialogCancel>
//                       <AlertDialogAction
//                         variant='destructive'
//                         disabled={isPending}
//                         onClick={async () => await onEnd(booking)}
//                       >
//                         End Session
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//                 {/* extend session */}
//                 {/* <button
//                   onClick={() => onExtend(booking, station.id)}
//                   disabled={isPending}
//                   className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-neutral-700 text-white font-medium disabled:opacity-60'
//                 >
//                   {isPending && <Loader2 className='h-3 w-3 animate-spin' />}
//                   +30m
//                 </button> */}
//                 <AlertDialog>
//                   <AlertDialogTrigger asChild>
//                     <button
//                       disabled={isPending}
//                       className='flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-neutral-700 text-white font-medium disabled:opacity-60'
//                     >
//                       {isPending && (
//                         <Loader2 className='h-3 w-3 animate-spin' />
//                       )}
//                       Extend
//                     </button>
//                   </AlertDialogTrigger>
//                   <AlertDialogContent size='sm'>
//                     <AlertDialogHeader>
//                       <AlertDialogTitle>Extend session</AlertDialogTitle>
//                       <AlertDialogDescription>
//                         Choose how much extra time to add.
//                       </AlertDialogDescription>
//                     </AlertDialogHeader>

//                     <div className='flex flex-col gap-2 py-2'>
//                       {options.map((opt) => (
//                         <button
//                           key={opt.value}
//                           onClick={() => setSelected(opt.value)}
//                           className={`text-left px-3 py-2 rounded-md text-sm border ${
//                             selected === opt.value
//                               ? 'border-cyan-400 bg-cyan-400/10'
//                               : 'border-neutral-700'
//                           }`}
//                         >
//                           {opt.label}
//                         </button>
//                       ))}
//                       <button
//                         onClick={() => setSelected(-1)}
//                         className={`text-left px-3 py-2 rounded-md text-sm border ${
//                           selected === -1
//                             ? 'border-cyan-400 bg-cyan-400/10'
//                             : 'border-neutral-700'
//                         }`}
//                       >
//                         Custom
//                       </button>
//                       {selected === -1 && (
//                         <input
//                           type='number'
//                           min={1}
//                           placeholder='Minutes'
//                           value={customMinutes}
//                           onChange={(e) => setCustomMinutes(e.target.value)}
//                           className='px-3 py-2 rounded-md text-sm bg-neutral-800 border border-neutral-700'
//                         />
//                       )}
//                     </div>

//                     <AlertDialogFooter>
//                       <AlertDialogCancel variant='ghost'>
//                         Cancel
//                       </AlertDialogCancel>
//                       <AlertDialogAction
//                         className='whitespace-normal wrap-break text-center'
//                         disabled={finalMinutes <= 0}
//                         onClick={() =>
//                           onExtend(booking, station.id, finalMinutes)
//                         }
//                       >
//                         Extend by {finalMinutes || 0} min
//                       </AlertDialogAction>
//                     </AlertDialogFooter>
//                   </AlertDialogContent>
//                 </AlertDialog>
//               </div>
//             )}
//           </div>
//         </>
//       ) : (
//         <p className='text-xs text-neutral-500'>No booking</p>
//       )}
//     </div>
//   );
// }

function getTimeLeft(endIso: string) {
  return Math.max(
    0,
    Math.round((new Date(endIso).getTime() - Date.now()) / 60_000),
  );
}

const STATION_TYPES = [
  { key: 'pc', label: 'PC' },
  { key: 'ps5', label: 'PS5' },
  { key: 'racing', label: 'Racing Sim' },
] as const;

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
  const [activeType, setActiveType] = useState<StationType>('pc');
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const supabase = createClient();
  const markExtensionPaid = useMarkExtensionPaid();

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

  const unpaidExtensionFor = (bookingId: string) =>
    extensions.find(
      (e) => e.booking_id === bookingId && e.payment_status === 'pending',
    );

  function unlockAudio() {
    const audio = new Audio('/sounds/session-due.mp3');
    audio.volume = 0;
    audio
      .play()
      .then(() => setAudioUnlocked(true))
      .catch(() => {});
  }

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

  // function handleExtend(booking: Booking, stationId: string) {
  //   addPending(booking.id);
  //   const promise = extendSession(booking.id, stationId, 30)
  //     .then((res) => {
  //       if (!res.ok)
  //         throw new Error('Station is booked right after — cannot extend.');
  //       return res;
  //     })
  //     .finally(() => removePending(booking.id));
  //   toast.promise(promise, {
  //     loading: 'Extending session…',
  //     success: 'Extended by 30 minutes',
  //     error: (err) =>
  //       err instanceof Error ? err.message : 'Failed to extend session',
  //   });
  // }
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
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('bookings-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          setBookings((prev) => {
            if (payload.eventType === 'INSERT')
              return [...prev, payload.new as Booking];
            if (payload.eventType === 'UPDATE')
              return prev.map((b) =>
                b.id === payload.new.id
                  ? ({ ...b, ...payload.new } as Booking)
                  : b,
              );
            if (payload.eventType === 'DELETE')
              return prev.filter((b) => b.id !== payload.old.id);
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);
  const currentBookingFor = (stationId: string) =>
    bookings
      .filter((b) => b.station_id === stationId && b.status === 'confirmed')
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

  const groupedStations = STATION_TYPES.map(({ key, label }) => ({
    key,
    label,
    stations: stations.filter((s) => s.type === key),
  }));

  // quick "active count" per group so staff glance the tab to see where the action is
  const activeCountFor = (type: StationType) =>
    stations
      .filter((s) => s.type === type)
      .filter((s) => {
        const b = currentBookingFor(s.id);
        return !!b?.session_started_at && !b?.session_ended_at;
      }).length;
  //   const totalActive = STATION_TYPES.reduce(
  //     (sum, t) => sum + activeCountFor(t.key),
  //     0,
  //   );

  //   return (
  //     <div>
  //       {!audioUnlocked && (
  //         <button
  //           onClick={unlockAudio}
  //           className='mb-4 flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-300'
  //         >
  //           🔊 Click to enable sound alerts for due sessions
  //         </button>
  //       )}
  //       <h2 className='text-lg font-semibold mb-3'>Live Sessions Board</h2>

  //       {/* Mobile: tab switcher instead of scrolling through everything */}
  //       <div className='flex sm:hidden gap-2 mb-4 overflow-x-auto'>
  //         {groupedStations.map(({ key, label, stations: groupStations }) => {
  //           if (groupStations.length === 0) return null;
  //           const activeCount = activeCountFor(key);
  //           return (
  //             <button
  //               key={key}
  //               onClick={() => setActiveType(key)}
  //               className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
  //                 activeType === key
  //                   ? 'bg-cyan-400 text-black'
  //                   : 'bg-neutral-800 text-neutral-400'
  //               }`}
  //             >
  //               {label}
  //               {activeCount > 0 && (
  //                 <span
  //                   className={`text-[10px] px-1.5 py-0.5 rounded-full ${
  //                     activeType === key
  //                       ? 'bg-black/20'
  //                       : 'bg-cyan-400 text-black'
  //                   }`}
  //                 >
  //                   {activeCount}
  //                 </span>
  //               )}
  //             </button>
  //           );
  //         })}
  //       </div>

  //       {/* Desktop/tablet: all groups stacked with headers, no tab needed */}
  //       <div className='flex flex-col gap-8'>
  //         {groupedStations.map(({ key, label, stations: groupStations }) => {
  //           if (groupStations.length === 0) return null;
  //           return (
  //             <section
  //               key={key}
  //               className={`${activeType === key ? 'block' : 'hidden'} sm:block`}
  //             >
  //               <h3 className='hidden sm:block text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-3'>
  //                 {label}
  //               </h3>
  //               <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 live-session-grid'>
  //                 {groupStations.map((station) => (
  //                   <StationCard
  //                     key={station.id}
  //                     station={station}
  //                     booking={currentBookingFor(station.id)}
  //                     pendingIds={pendingIds}
  //                     unpaidExtension={
  //                       currentBookingFor(station.id)
  //                         ? unpaidExtensionFor(currentBookingFor(station.id)!.id)
  //                         : undefined
  //                     }
  //                     onStart={handleStart}
  //                     onEnd={handleEnd}
  //                     onExtend={handleExtend}
  //                     onMarkExtensionPaid={(id) => markExtensionPaid.mutate(id)}
  //                   />
  //                 ))}
  //               </div>
  //             </section>
  //           );
  //         })}
  //       </div>
  //     </div>
  //   );
  // }
  const totalActive = STATION_TYPES.reduce(
    (sum, t) => sum + activeCountFor(t.key),
    0,
  );

  return (
    <div className='relative'>
      {/* HUD header */}
      <div className='mb-5 overflow-hidden rounded-2xl border border-cyan-400/20 bg-[linear-gradient(140deg,#04080f_0%,#070a12_60%,#0a0410_100%)] p-4 shadow-[0_0_40px_-18px_rgba(34,211,238,0.7)]'>
        <div className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4'>
          <div className='min-w-0'>
            <p className='font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/70'>
              Operations / Realtime
            </p>
            <h2 className='mt-1 truncate text-lg font-semibold tracking-wide text-neutral-50 sm:text-xl'>
              Live Sessions Board
            </h2>
          </div>
          <div className='flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5'>
            <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.9)]' />
            <span className='font-mono text-xs text-cyan-200'>
              {totalActive} <span className='text-cyan-400/60'>active</span>
            </span>
          </div>
        </div>
        <div className='mt-3 h-px w-full bg-linear-to-r from-cyan-400/50 via-fuchsia-500/30 to-transparent' />
      </div>

      {!audioUnlocked && (
        <button
          onClick={unlockAudio}
          className='mb-4 flex w-full items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-amber-300'
        >
          🔊 Enable sound alerts for due sessions
        </button>
      )}

      {/* Mobile: tab switcher */}
      <div className='mb-4 flex gap-2 overflow-x-auto pb-1 sm:hidden'>
        {groupedStations.map(({ key, label, stations: groupStations }) => {
          if (groupStations.length === 0) return null;
          const activeCount = activeCountFor(key);
          return (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
                activeType === key
                  ? 'border-cyan-400 bg-cyan-400 text-black shadow-[0_0_18px_-4px_rgba(34,211,238,0.9)]'
                  : 'border-white/10 bg-white/5 text-neutral-400'
              }`}
            >
              {label}
              {activeCount > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    activeType === key
                      ? 'bg-black/25 text-black'
                      : 'bg-cyan-400 text-black'
                  }`}
                >
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop/tablet: all groups stacked */}
      <div className='flex flex-col gap-8'>
        {groupedStations.map(({ key, label, stations: groupStations }) => {
          if (groupStations.length === 0) return null;
          return (
            <section
              key={key}
              className={`${activeType === key ? 'block' : 'hidden'} sm:block`}
            >
              <div className='mb-3 hidden items-center gap-3 sm:flex'>
                <h3 className='font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-fuchsia-400'>
                  {label}
                </h3>
                <span className='font-mono text-[10px] text-neutral-600'>
                  {activeCountFor(key)}/{groupStations.length}
                </span>
                <span className='h-px flex-1 bg-linear-to-r from-fuchsia-500/40 to-transparent' />
              </div>
              <div className='live-session-grid grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
                {groupStations.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    booking={currentBookingFor(station.id)}
                    pendingIds={pendingIds}
                    // unpaidExtension={
                    //   currentBookingFor(station.id)
                    //     ? unpaidExtensionFor(currentBookingFor(station.id)!.id)
                    //     : undefined
                    // }
                    onStart={handleStart}
                    onEnd={handleEnd}
                    onExtend={handleExtend}
                    // onMarkExtensionPaid={(id) => markExtensionPaid.mutate(id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
