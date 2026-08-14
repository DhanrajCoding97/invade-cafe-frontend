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
import { PushNotificationToggle } from './PushNotificationToggle';

function getTimeLeft(endIso: string) {
  return Math.max(
    0,
    Math.round((new Date(endIso).getTime() - Date.now()) / 60_000),
  );
}
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

const STATION_TYPES = [
  { key: 'pc', label: 'PC' },
  { key: 'ps5', label: 'PS5' },
  { key: 'racing', label: 'Racing Sim' },
] as const;

type StationType = (typeof STATION_TYPES)[number]['key'];

// export default function LiveSessionBoard({
//   stations,
//   initialBookings,
//   initialExtensions,
// }: {
//   stations: Station[];
//   initialBookings: Booking[];
//   initialExtensions: Extension[];
// }) {
//   const [bookings, setBookings] = useState(initialBookings);
//   const [activeType, setActiveType] = useState<StationType>('pc');
//   const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
//   const [audioUnlocked, setAudioUnlocked] = useState(false);
//   const supabase = createClient();
//   const markExtensionPaid = useMarkExtensionPaid();

//   useDueSessions(bookings);

//   const { data: extensions = initialExtensions } = useQuery({
//     queryKey: ['session-extensions'],
//     queryFn: async () => {
//       const { data } = await supabase
//         .from('session_extensions')
//         .select('*')
//         .eq('payment_status', 'pending');
//       return data ?? [];
//     },
//     initialData: initialExtensions,
//   });

//   const unpaidExtensionFor = (bookingId: string) =>
//     extensions.find(
//       (e) => e.booking_id === bookingId && e.payment_status === 'pending',
//     );

//   // function unlockAudio() {
//   //   const audio = new Audio('/sounds/session-due.mp3');
//   //   audio.volume = 0;
//   //   audio
//   //     .play()
//   //     .then(() => setAudioUnlocked(true))
//   //     .catch(() => {});
//   // }
//   // function PushNotificationToggle() {
//   //   const [subscribed, setSubscribed] = useState(false);
//   //   const [loading, setLoading] = useState(false);

//   //   async function handleEnable() {
//   //     setLoading(true);
//   //     try {
//   //       await subscribeToPush();
//   //       setSubscribed(true);
//   //       toast.success('Push notifications enabled');
//   //     } catch (err: any) {
//   //       toast.error(err?.message ?? 'Failed to enable notifications');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   //   if (subscribed) return null;

//   //   return (
//   //     <button
//   //       onClick={handleEnable}
//   //       disabled={loading}
//   //       className='mb-4 flex w-full items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-cyan-300'
//   //     >
//   //       🔔 {loading ? 'Enabling…' : 'Enable push notifications'}
//   //     </button>
//   //   );
//   // }
//   function addPending(id: string) {
//     setPendingIds((prev) => new Set(prev).add(id));
//   }
//   function removePending(id: string) {
//     setPendingIds((prev) => {
//       const next = new Set(prev);
//       next.delete(id);
//       return next;
//     });
//   }
//   function handleStart(booking: Booking) {
//     addPending(booking.id);
//     const promise = startSession(booking.id).finally(() =>
//       removePending(booking.id),
//     );
//     toast.promise(promise, {
//       loading: 'Starting session…',
//       success: 'Session started',
//       error: (err) =>
//         err instanceof Error ? err.message : 'Failed to start session',
//     });
//   }

//   async function handleEnd(booking: Booking) {
//     addPending(booking.id);

//     try {
//       await toast.promise(endSession(booking.id), {
//         loading: 'Ending session...',
//         success: 'Session ended',
//         error: (err) =>
//           err instanceof Error ? err.message : 'Failed to end session',
//       });
//     } finally {
//       removePending(booking.id);
//     }
//   }

//   // function handleExtend(booking: Booking, stationId: string) {
//   //   addPending(booking.id);
//   //   const promise = extendSession(booking.id, stationId, 30)
//   //     .then((res) => {
//   //       if (!res.ok)
//   //         throw new Error('Station is booked right after — cannot extend.');
//   //       return res;
//   //     })
//   //     .finally(() => removePending(booking.id));
//   //   toast.promise(promise, {
//   //     loading: 'Extending session…',
//   //     success: 'Extended by 30 minutes',
//   //     error: (err) =>
//   //       err instanceof Error ? err.message : 'Failed to extend session',
//   //   });
//   // }
//   function handleExtend(booking: Booking, stationId: string, minutes: number) {
//     addPending(booking.id);
//     const promise = extendSession(booking.id, stationId, minutes)
//       .then((res) => {
//         if (!res.ok) throw new Error(res.reason);
//         return res;
//       })
//       .finally(() => removePending(booking.id));

//     toast.promise(promise, {
//       loading: 'Extending session…',
//       success: (res: any) =>
//         `Extended by ${minutes} min — ₹${res.amountDue} due`,
//       error: (err) =>
//         err instanceof Error ? err.message : 'Failed to extend session',
//     });
//   }

//   useEffect(() => {
//     if ('Notification' in window && Notification.permission === 'default') {
//       Notification.requestPermission();
//     }
//   }, []);

//   useEffect(() => {
//     const channel = supabase
//       .channel('bookings-live')
//       .on(
//         'postgres_changes',
//         { event: '*', schema: 'public', table: 'bookings' },
//         (payload) => {
//           setBookings((prev) => {
//             if (payload.eventType === 'INSERT')
//               return [...prev, payload.new as Booking];
//             if (payload.eventType === 'UPDATE')
//               return prev.map((b) =>
//                 b.id === payload.new.id
//                   ? ({ ...b, ...payload.new } as Booking)
//                   : b,
//               );
//             if (payload.eventType === 'DELETE')
//               return prev.filter((b) => b.id !== payload.old.id);
//             return prev;
//           });
//         },
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [supabase]);
//   const currentBookingFor = (stationId: string) =>
//     bookings
//       .filter((b) => b.station_id === stationId && b.status === 'confirmed')
//       .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

//   const groupedStations = STATION_TYPES.map(({ key, label }) => ({
//     key,
//     label,
//     stations: stations.filter((s) => s.type === key),
//   }));
//     const totalActive = STATION_TYPES.reduce(
//       (sum, t) => sum + activeCountFor(t.key),
//       0,
//     );

//   // quick "active count" per group so staff glance the tab to see where the action is
//   const activeCountFor = (type: StationType) =>
//     stations
//       .filter((s) => s.type === type)
//       .filter((s) => {
//         const b = currentBookingFor(s.id);
//         return !!b?.session_started_at && !b?.session_ended_at;
//       }).length;
//   //   const totalActive = STATION_TYPES.reduce(
//   //     (sum, t) => sum + activeCountFor(t.key),
//   //     0,
//   //   );

//   //   return (
//   //     <div>
//   //       {!audioUnlocked && (
//   //         <button
//   //           onClick={unlockAudio}
//   //           className='mb-4 flex items-center gap-2 rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs text-amber-300'
//   //         >
//   //           🔊 Click to enable sound alerts for due sessions
//   //         </button>
//   //       )}
//   //       <h2 className='text-lg font-semibold mb-3'>Live Sessions Board</h2>

//   //       {/* Mobile: tab switcher instead of scrolling through everything */}
//   //       <div className='flex sm:hidden gap-2 mb-4 overflow-x-auto'>
//   //         {groupedStations.map(({ key, label, stations: groupStations }) => {
//   //           if (groupStations.length === 0) return null;
//   //           const activeCount = activeCountFor(key);
//   //           return (
//   //             <button
//   //               key={key}
//   //               onClick={() => setActiveType(key)}
//   //               className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
//   //                 activeType === key
//   //                   ? 'bg-cyan-400 text-black'
//   //                   : 'bg-neutral-800 text-neutral-400'
//   //               }`}
//   //             >
//   //               {label}
//   //               {activeCount > 0 && (
//   //                 <span
//   //                   className={`text-[10px] px-1.5 py-0.5 rounded-full ${
//   //                     activeType === key
//   //                       ? 'bg-black/20'
//   //                       : 'bg-cyan-400 text-black'
//   //                   }`}
//   //                 >
//   //                   {activeCount}
//   //                 </span>
//   //               )}
//   //             </button>
//   //           );
//   //         })}
//   //       </div>

//   //       {/* Desktop/tablet: all groups stacked with headers, no tab needed */}
//   //       <div className='flex flex-col gap-8'>
//   //         {groupedStations.map(({ key, label, stations: groupStations }) => {
//   //           if (groupStations.length === 0) return null;
//   //           return (
//   //             <section
//   //               key={key}
//   //               className={`${activeType === key ? 'block' : 'hidden'} sm:block`}
//   //             >
//   //               <h3 className='hidden sm:block text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-3'>
//   //                 {label}
//   //               </h3>
//   //               <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 live-session-grid'>
//   //                 {groupStations.map((station) => (
//   //                   <StationCard
//   //                     key={station.id}
//   //                     station={station}
//   //                     booking={currentBookingFor(station.id)}
//   //                     pendingIds={pendingIds}
//   //                     unpaidExtension={
//   //                       currentBookingFor(station.id)
//   //                         ? unpaidExtensionFor(currentBookingFor(station.id)!.id)
//   //                         : undefined
//   //                     }
//   //                     onStart={handleStart}
//   //                     onEnd={handleEnd}
//   //                     onExtend={handleExtend}
//   //                     onMarkExtensionPaid={(id) => markExtensionPaid.mutate(id)}
//   //                   />
//   //                 ))}
//   //               </div>
//   //             </section>
//   //           );
//   //         })}
//   //       </div>
//   //     </div>
//   //   );
//   // }

//   return (
//     <div className='relative'>
//       {/* HUD header */}
//       <div className='mb-5 overflow-hidden rounded-2xl border border-cyan-400/20 bg-[linear-gradient(140deg,#04080f_0%,#070a12_60%,#0a0410_100%)] p-4 shadow-[0_0_40px_-18px_rgba(34,211,238,0.7)]'>
//         <div className='grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4'>
//           <div className='min-w-0'>
//             <p className='font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400/70'>
//               Operations / Realtime
//             </p>
//             <h2 className='mt-1 truncate text-lg font-semibold tracking-wide text-neutral-50 sm:text-xl'>
//               Live Sessions Board
//             </h2>
//           </div>

//           <PushNotificationToggle />
//           <div className='flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5'>
//             <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.9)]' />
//             <span className='font-mono text-xs text-cyan-200'>
//               {totalActive} <span className='text-cyan-400/60'>active</span>
//             </span>
//           </div>
//         </div>
//         <div className='mt-3 h-px w-full bg-linear-to-r from-cyan-400/50 via-fuchsia-500/30 to-transparent' />
//       </div>

//       {/* {!audioUnlocked && (
//         <button
//           onClick={unlockAudio}
//           className='mb-4 flex w-full items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-amber-300'
//         >
//           🔊 Enable sound alerts for due sessions
//         </button>
//       )} */}

//       {/* Mobile: tab switcher */}
//       <div className='mb-4 flex gap-2 overflow-x-auto pb-1 sm:hidden'>
//         {groupedStations.map(({ key, label, stations: groupStations }) => {
//           if (groupStations.length === 0) return null;
//           const activeCount = activeCountFor(key);
//           return (
//             <button
//               key={key}
//               onClick={() => setActiveType(key)}
//               className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 font-mono text-[11px] uppercase tracking-wider transition-all ${
//                 activeType === key
//                   ? 'border-cyan-400 bg-cyan-400 text-black shadow-[0_0_18px_-4px_rgba(34,211,238,0.9)]'
//                   : 'border-white/10 bg-white/5 text-neutral-400'
//               }`}
//             >
//               {label}
//               {activeCount > 0 && (
//                 <span
//                   className={`rounded-full px-1.5 py-0.5 text-[10px] ${
//                     activeType === key
//                       ? 'bg-black/25 text-black'
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

//       {/* Desktop/tablet: all groups stacked */}
//       <div className='flex flex-col gap-8'>
//         {groupedStations.map(({ key, label, stations: groupStations }) => {
//           if (groupStations.length === 0) return null;
//           return (
//             <section
//               key={key}
//               className={`${activeType === key ? 'block' : 'hidden'} sm:block`}
//             >
//               <div className='mb-3 hidden items-center gap-3 sm:flex'>
//                 <h3 className='font-mono text-[11px] font-semibold uppercase tracking-[0.3em] text-fuchsia-400'>
//                   {label}
//                 </h3>
//                 <span className='font-mono text-[10px] text-neutral-600'>
//                   {activeCountFor(key)}/{groupStations.length}
//                 </span>
//                 <span className='h-px flex-1 bg-linear-to-r from-fuchsia-500/40 to-transparent' />
//               </div>
//               <div className='items-start grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
//                 {groupStations.map((station) => (
//                   <StationCard
//                     key={station.id}
//                     station={station}
//                     booking={currentBookingFor(station.id)}
//                     pendingIds={pendingIds}
//                     // unpaidExtension={
//                     //   currentBookingFor(station.id)
//                     //     ? unpaidExtensionFor(currentBookingFor(station.id)!.id)
//                     //     : undefined
//                     // }
//                     onStart={handleStart}
//                     onEnd={handleEnd}
//                     onExtend={handleExtend}
//                     // onMarkExtensionPaid={(id) => markExtensionPaid.mutate(id)}
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

          <PushNotificationToggle />
          <div className='flex shrink-0 items-center gap-2 rounded-xl border border-cyan-400/25 bg-cyan-400/5 px-3 py-1.5'>
            <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.9)]' />
            <span className='font-mono text-xs text-cyan-200'>
              {totalActive} <span className='text-cyan-400/60'>active</span>
            </span>
          </div>
        </div>
        <div className='mt-3 h-px w-full bg-linear-to-r from-cyan-400/50 via-fuchsia-500/30 to-transparent' />
      </div>

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

          // Occupied (any booking — active/due/late/no-show/booked) render
          // first so staff see what needs attention immediately. Free
          // stations render in their own grid below — keeping them in a
          // separate grid means a tall occupied card never stretches a
          // row of otherwise-empty free cards.
          const occupied = groupStations.filter((s) => currentBookingFor(s.id));
          const free = groupStations.filter((s) => !currentBookingFor(s.id));

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

              {occupied.length > 0 && (
                <div className='items-start grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4'>
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
              )}

              {free.length > 0 && (
                <div
                  className={`items-start grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 ${
                    occupied.length > 0 ? 'mt-3' : ''
                  }`}
                >
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
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
