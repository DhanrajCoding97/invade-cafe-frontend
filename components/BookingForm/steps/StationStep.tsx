'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { createClient } from '@/lib/supabase/client';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';
import { getDisplayRate } from '@/lib/pricing';
import StationStepSkeleton from '@/components/skeletons/StationStepSkeleton';
import { useRealtimeBookingSync } from '@/hooks/useRealtimeBookingSync';

// interface Station {
//   id: string;
//   name: string;
//   specs: Record<string, string> | null;
//   hourly_rate: number;
//   status: 'available' | 'booked' | 'maintenance';
//   activeUntil: string | null;
// }

// async function fetchStations(
//   device: string,
//   tier?: string,
// ): Promise<Station[]> {
//   const supabase = createClient();
//   let query = supabase
//     .from('stations')
//     .select('id, name, specs, hourly_rate, max_players, status')
//     .eq('type', device === 'vr' ? 'ps5' : device); // vr books a ps5 slot, handled separately below

//   if (device === 'racing' && tier === 'multiplayer') {
//     query = query.gte('max_players', 2);
//   }

//   const { data, error } = await query;
//   if (error) throw error;
//   return data ?? [];
// }

// export default function StationStep() {
//   const { control, watch } = useFormContext<BookingFormValues>();
//   const device = watch('device');
//   const players = watch('players');
//   const tier = watch('tier');

//   const {
//     data: stations = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ['stations', device, tier],
//     queryFn: () => fetchStations(device!, tier),
//     enabled: !!device,
//     staleTime: 30_000, // stations don't change every second — 30s cache is plenty
//   });

//   if (isLoading)
//     // return <p className='text-sm text-white/50'>Loading stations…</p>;
//     return <StationStepSkeleton />;
//   if (error)
//     return <p className='text-sm text-red-400'>Couldn't load stations</p>;

//   const STATUS_LABEL: Record<Station['status'], string> = {
//     available: 'Available',
//     booked: 'Booked',
//     maintenance: 'Under maintenance',
//   };
//   const STATUS_COLOR: Record<Station['status'], string> = {
//     available: 'text-green-400',
//     booked: 'text-amber-400',
//     maintenance: 'text-red-600',
//   };

//   return (
//     <Controller
//       name='stationId'
//       control={control}
//       render={({ field, fieldState }) => (
//         <Field data-invalid={fieldState.invalid}>
//           <FieldLabel>Choose your preferred station</FieldLabel>
//           <div className='space-y-2'>
//             {stations.map((station) => {
//               const selected = field.value === station.id;
//               const disabled = station.status !== 'available';
//               const rate = getDisplayRate({
//                 device,
//                 players,
//                 tier,
//                 fallbackRate: station.hourly_rate,
//               });

//               return (
//                 <button
//                   key={station.id}
//                   type='button'
//                   disabled={disabled}
//                   onClick={() => field.onChange(station.id)}
//                   className={[
//                     'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
//                     selected
//                       ? 'border-cyan-400 bg-cyan-400/10 text-white'
//                       : 'border-cyan-400/40 text-cyan-300',
//                     disabled
//                       ? 'cursor-not-allowed opacity-40'
//                       : 'hover:border-cyan-400',
//                   ].join(' ')}
//                 >
//                   <div>
//                     <p className='text-sm font-semibold text-white'>
//                       {station.name}
//                     </p>
//                     {station.specs && (
//                       <p className='text-xs text-white/50'>
//                         {Object.values(station.specs).join(' · ')}
//                       </p>
//                     )}
//                   </div>
//                   <div className='text-right'>
//                     <p className='text-sm font-bold text-cyan-400'>
//                       ₹{rate}/hr
//                     </p>
//                     <p className={`text-xs ${STATUS_COLOR[station.status]}`}>
//                       {STATUS_LABEL[station.status]}
//                     </p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
//         </Field>
//       )}
//     />
//   );
// }

interface Station {
  id: string;
  name: string;
  specs: Record<string, string> | null;
  hourly_rate: number;
  status: 'available' | 'maintenance';
  activeUntil: string | null; // ISO string if currently in-use, else null
}

async function fetchStations(
  device: string,
  tier?: string,
): Promise<Station[]> {
  const supabase = createClient();

  let query = supabase
    .from('stations')
    .select('id, name, specs, hourly_rate, max_players, status')
    .eq('type', device === 'vr' ? 'ps5' : device);

  if (device === 'racing' && tier === 'multiplayer') {
    query = query.gte('max_players', 2);
  }

  const { data: stations, error } = await query;
  if (error) throw error;
  if (!stations || stations.length === 0) return [];

  const stationIds = stations.map((s) => s.id);

  // currently active sessions on these stations — started, not yet ended
  const { data: activeSessions, error: sessionsError } = await supabase
    .from('bookings')
    .select('station_id, session_started_at, duration_hours, extended_until')
    .in('station_id', stationIds)
    .eq('status', 'confirmed')
    .not('session_started_at', 'is', null)
    .is('session_ended_at', null);

  if (sessionsError) throw sessionsError;

  const activeUntilByStation = new Map<string, string>();
  const now = Date.now();

  (activeSessions ?? []).forEach((s) => {
    if (!s.session_started_at) return;
    const start = new Date(s.session_started_at);
    const scheduledEnd = new Date(start);
    scheduledEnd.setHours(scheduledEnd.getHours() + Number(s.duration_hours));
    const end = s.extended_until ? new Date(s.extended_until) : scheduledEnd;

    // only treat it as "currently active" if the computed end is still in the future —
    // a session that ran past its time but staff hasn't hit "End" yet shouldn't
    // show a negative/zero countdown
    if (end.getTime() > now) {
      activeUntilByStation.set(s.station_id, end.toISOString());
    }
  });

  return stations.map((s) => ({
    ...s,
    activeUntil: activeUntilByStation.get(s.id) ?? null,
  })) as Station[];
}

function getMinutesLeft(iso: string): number {
  return Math.max(
    0,
    Math.round((new Date(iso).getTime() - Date.now()) / 60_000),
  );
}

export default function StationStep() {
  useRealtimeBookingSync();
  const { control, watch } = useFormContext<BookingFormValues>();
  const device = watch('device');
  const players = watch('players');
  const tier = watch('tier');

  const {
    data: stations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['stations', device, tier],
    queryFn: () => fetchStations(device!, tier),
    enabled: !!device,
    staleTime: 30_000,
    refetchInterval: 60_000, // keep the "in X min" countdown roughly fresh
  });

  if (isLoading) return <StationStepSkeleton />;
  if (error)
    return <p className='text-sm text-red-400'>Couldn't load stations</p>;

  return (
    <Controller
      name='stationId'
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Choose your preferred station</FieldLabel>
          <div className='space-y-2'>
            {stations.map((station) => {
              const selected = field.value === station.id;
              const isMaintenance = station.status === 'maintenance';
              const rate = getDisplayRate({
                device,
                players,
                tier,
                fallbackRate: station.hourly_rate,
              });

              const statusLabel = isMaintenance
                ? 'Under maintenance'
                : station.activeUntil
                  ? `Available in ${getMinutesLeft(station.activeUntil)} min`
                  : 'Available';

              const statusColor = isMaintenance
                ? 'text-red-600'
                : station.activeUntil
                  ? 'text-amber-400'
                  : 'text-green-400';

              return (
                <button
                  key={station.id}
                  type='button'
                  disabled={isMaintenance}
                  onClick={() => field.onChange(station.id)}
                  className={[
                    'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
                    selected
                      ? 'border-cyan-400 bg-cyan-400/10 text-white'
                      : 'border-cyan-400/40 text-cyan-300',
                    isMaintenance
                      ? 'cursor-not-allowed opacity-40'
                      : 'hover:border-cyan-400',
                  ].join(' ')}
                >
                  <div>
                    <p className='text-sm font-semibold text-white'>
                      {station.name}
                    </p>
                    {station.specs && (
                      <p className='text-xs text-white/50'>
                        {Object.values(station.specs).join(' · ')}
                      </p>
                    )}
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-bold text-cyan-400'>
                      ₹{rate}/hr
                    </p>
                    <p className={`text-xs ${statusColor}`}>{statusLabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
