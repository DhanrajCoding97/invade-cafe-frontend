'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { createClient } from '@/lib/supabase/client';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';
import { getDisplayRate } from '@/lib/pricing';
import StationStepSkeleton from '@/components/skeletons/StationStepSkeleton';
import { useRealtimeBookingSync } from '@/hooks/useRealtimeBookingSync';
import { format } from 'date-fns';
import { useCafeSettings } from '@/hooks/use-cafe-settings';
import { useMemo } from 'react';
import { CafeSettings } from '@/types';

interface Station {
  id: string;
  name: string;
  specs: Record<string, string> | null;
  hourly_rate: number;
  operational_status: 'active' | 'maintenance' | 'offline'; // renamed from status
  conflictUntil: string | null;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function getMinutesLeft(iso: string): number {
  return Math.max(
    1,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 60_000),
  );
}

// type StationOption = Station & {
//   isCombo?: boolean;
//   comboStationIds?: [string, string];
// };

// async function fetchStations(
//   device: string,
//   tier: string | undefined,
//   date: Date,
//   startTime: string,
//   duration: number,
// ): Promise<Station[]> {
//   const supabase = createClient();

//   let query = supabase
//     .from('stations')
//     .select('id, name, specs, hourly_rate, max_players,  operational_status')
//     .eq('type', device === 'vr' ? 'ps5' : device)
//     .eq('operational_status', 'active');

//   if (device === 'racing' && tier === 'multiplayer') {
//     query = query.gte('max_players', 2);
//   }

//   const { data: stations, error } = await query;
//   if (error) throw error;
//   if (!stations || stations.length === 0) return [];

//   const stationIds = stations.map((s) => s.id);
//   const dateStr = format(date, 'yyyy-MM-dd');

//   const { data, error: conflictsError } = await supabase.rpc(
//     'get_station_conflicts_for_slot',
//     {
//       p_station_ids: stationIds,
//       p_date: dateStr,
//       p_start_time: startTime,
//       p_duration_hours: duration,
//     },
//   );

//   if (conflictsError) throw conflictsError;

//   const conflictUntilByStation = new Map<string, string>();
//   const conflicts = (data ?? []) as {
//     station_id: string;
//     conflict_end: string;
//   }[];

//   conflicts.forEach((c) => {
//     conflictUntilByStation.set(c.station_id, c.conflict_end);
//   });

//   // VR-specific check: only one headset, shared across all PS5s
//   if (device === 'vr') {
//     const { data: vrData, error: vrError } = await supabase.rpc(
//       'get_vr_conflict_for_slot',
//       { p_date: dateStr, p_start_time: startTime, p_duration_hours: duration },
//     );
//     if (vrError) throw vrError;

//     const vrConflictEnd = vrData?.[0]?.conflict_end ?? null;
//     if (vrConflictEnd) {
//       // headset is booked for this slot — every PS5 is effectively blocked for VR use
//       return stations.map((s) => ({
//         ...s,
//         conflictUntil: vrConflictEnd,
//       })) as Station[];
//     }
//   }

//   return stations.map((s) => ({
//     ...s,
//     conflictUntil: conflictUntilByStation.get(s.id) ?? null,
//   })) as Station[];
// }

// export default function StationStep() {
//   useRealtimeBookingSync();
//   const { control, watch } = useFormContext<BookingFormValues>();
//   const device = watch('device');
//   const players = watch('players');
//   const tier = watch('tier');
//   const date = watch('date');
//   const startTime = watch('startTime');
//   const duration = watch('duration');
//   const { data: cafeSettings } = useCafeSettings();
//   const {
//     data: stations = [],
//     isLoading,
//     error,
//   } = useQuery({
//     queryKey: ['stations', device, tier, date, startTime, duration],
//     queryFn: () => fetchStations(device!, tier, date, startTime, duration),
//     enabled: !!device && !!date && !!startTime && !!duration,
//     staleTime: 0,
//     refetchInterval: 10_000,
//     refetchOnMount: 'always',
//     refetchOnWindowFocus: true,
//   });

//   const sortedStations = useMemo(
//     () =>
//       [...stations].sort((a, b) =>
//         a.name.localeCompare(b.name, undefined, {
//           numeric: true,
//           sensitivity: 'base',
//         }),
//       ),
//     [stations],
//   );

//   if (isLoading) return <StationStepSkeleton />;
//   if (error)
//     return <p className='text-sm text-red-400'>Couldn't load stations</p>;

//   return (
//     <Controller
//       name='stationId'
//       control={control}
//       render={({ field, fieldState }) => (
//         <Field data-invalid={fieldState.invalid}>
//           <FieldLabel>Choose your preferred station</FieldLabel>
//           <div className='space-y-2'>
//             {sortedStations.map((station) => {
//               const selected = field.value === station.id;
//               // const isMaintenance = station.status === 'maintenance';
//               const rate =
//                 station && cafeSettings
//                   ? getDisplayRate({
//                       device,
//                       players,
//                       tier,
//                       fallbackRate: station.hourly_rate,
//                       settings: cafeSettings,
//                     })
//                   : 0;

//               const isMaintenance =
//                 station.operational_status === 'maintenance';
//               const isBookedForSlot = !!station.conflictUntil;
//               const isDisabled = isMaintenance || isBookedForSlot;

//               const statusLabel = isMaintenance
//                 ? 'Under maintenance'
//                 : isBookedForSlot
//                   ? `Booked until ${formatTime(station.conflictUntil!)}`
//                   : 'Available';

//               const statusColor =
//                 isMaintenance || isBookedForSlot
//                   ? 'text-red-500'
//                   : 'text-green-400';

//               return (
//                 <button
//                   key={station.id}
//                   type='button'
//                   disabled={isDisabled}
//                   onClick={() => field.onChange(station.id)}
//                   className={[
//                     'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
//                     selected
//                       ? 'border-cyan-400 bg-cyan-400/10 text-white'
//                       : 'border-cyan-400/40 text-cyan-300',
//                     isDisabled
//                       ? 'cursor-not-allowed opacity-50 border-white/10 bg-white/5'
//                       : 'hover:border-cyan-400 hover:bg-cyan-400/5',
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
//                     {/* <p className={`text-xs ${statusColor}`}>{statusLabel}</p> */}
//                     <div
//                       className={`flex items-center justify-end gap-1 text-xs ${statusColor}`}
//                     >
//                       <span
//                         className={[
//                           'h-2 w-2 rounded-full',
//                           isMaintenance || isBookedForSlot
//                             ? 'bg-red-500'
//                             : 'bg-green-400',
//                         ].join(' ')}
//                       />
//                       <span>{statusLabel}</span>
//                     </div>
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
type StationOption = Station & {
  isCombo?: boolean;
  comboStationIds?: [string, string];
};

async function fetchStations(
  device: string,
  tier: string | undefined,
  date: Date,
  startTime: string,
  duration: number,
  cafeSettings: CafeSettings,
): Promise<StationOption[]> {
  const supabase = createClient();
  const dateStr = format(date, 'yyyy-MM-dd');

  // --- PC racing multiplayer: build combo entries instead of individual PCs ---
  // --- Racing multiplayer ---
  // PS5 racing cockpit supports 2 players by itself.
  // PC racing requires both PC cockpits together.
  if (device === 'racing' && tier === 'multiplayer') {
    const { data: racingStations, error } = await supabase
      .from('stations')
      .select('id, name, specs, hourly_rate, max_players, operational_status')
      .eq('type', 'racing')
      .eq('operational_status', 'active')
      .order('display_order', { ascending: true });

    if (error) throw error;
    if (!racingStations?.length) return [];

    const ps5Station = racingStations.find(
      (station) =>
        station.specs?.powered_by === 'ps5' && station.max_players >= 2,
    );

    const pcStations = racingStations.filter(
      (station) => station.specs?.powered_by === 'pc',
    );

    const result: StationOption[] = [];

    // --------------------------------------------------
    // PS5 racing cockpit
    // --------------------------------------------------

    if (ps5Station) {
      const { data: conflictData, error: conflictsError } = await supabase.rpc(
        'get_station_conflicts_for_slot',
        {
          p_station_ids: [ps5Station.id],
          p_date: dateStr,
          p_start_time: startTime,
          p_duration_hours: duration,
        },
      );

      if (conflictsError) throw conflictsError;

      const conflictUntil =
        (
          conflictData as { station_id: string; conflict_end: string }[] | null
        )?.find((c) => c.station_id === ps5Station.id)?.conflict_end ?? null;

      result.push({
        ...ps5Station,
        conflictUntil,
        isCombo: false,
      } as StationOption);
    }

    // --------------------------------------------------
    // PC racing cockpits
    // Both PCs must be available for multiplayer
    // --------------------------------------------------

    if (pcStations.length >= 2) {
      const pcStationIds = pcStations.map((station) => station.id);

      const { data: conflictData, error: conflictsError } = await supabase.rpc(
        'get_station_conflicts_for_slot',
        {
          p_station_ids: pcStationIds,
          p_date: dateStr,
          p_start_time: startTime,
          p_duration_hours: duration,
        },
      );

      if (conflictsError) throw conflictsError;

      const conflictMap = new Map<string, string>();

      (
        (conflictData ?? []) as {
          station_id: string;
          conflict_end: string;
        }[]
      ).forEach((conflict) => {
        conflictMap.set(conflict.station_id, conflict.conflict_end);
      });

      // Pair the PC racing cockpits
      for (let i = 0; i + 1 < pcStations.length; i += 2) {
        const a = pcStations[i];
        const b = pcStations[i + 1];

        const conflictUntil =
          conflictMap.get(a.id) ?? conflictMap.get(b.id) ?? null;

        result.push({
          id: `combo:${a.id}:${b.id}`,
          name: `${a.name} + ${b.name}`,
          specs: a.specs,
          hourly_rate: getDisplayRate({
            device: 'racing',
            players: 2,
            tier: 'multiplayer',
            fallbackRate: a.hourly_rate + b.hourly_rate,
            settings: cafeSettings,
          }),
          max_players: 2,
          operational_status: 'active',
          conflictUntil,
          isCombo: true,
          comboStationIds: [a.id, b.id],
        } as StationOption);
      }
    }

    return result;
  }

  // --- everything else: unchanged existing logic ---
  let query = supabase
    .from('stations')
    .select('id, name, specs, hourly_rate, max_players,  operational_status')
    .eq('type', device === 'vr' ? 'ps5' : device)
    .eq('operational_status', 'active');

  if (device === 'racing' && tier === 'multiplayer') {
    query = query.gte('max_players', 2);
  }

  const { data: stations, error } = await query;
  if (error) throw error;
  if (!stations || stations.length === 0) return [];

  const stationIds = stations.map((s) => s.id);

  const { data, error: conflictsError } = await supabase.rpc(
    'get_station_conflicts_for_slot',
    {
      p_station_ids: stationIds,
      p_date: dateStr,
      p_start_time: startTime,
      p_duration_hours: duration,
    },
  );

  if (conflictsError) throw conflictsError;

  const conflictUntilByStation = new Map<string, string>();
  const conflicts = (data ?? []) as {
    station_id: string;
    conflict_end: string;
  }[];

  conflicts.forEach((c) => {
    conflictUntilByStation.set(c.station_id, c.conflict_end);
  });

  if (device === 'vr') {
    const { data: vrData, error: vrError } = await supabase.rpc(
      'get_vr_conflict_for_slot',
      { p_date: dateStr, p_start_time: startTime, p_duration_hours: duration },
    );
    if (vrError) throw vrError;

    const vrConflictEnd = vrData?.[0]?.conflict_end ?? null;
    if (vrConflictEnd) {
      return stations.map((s) => ({
        ...s,
        conflictUntil: vrConflictEnd,
      })) as StationOption[];
    }
  }

  return stations.map((s) => ({
    ...s,
    conflictUntil: conflictUntilByStation.get(s.id) ?? null,
  })) as StationOption[];
}

export default function StationStep() {
  useRealtimeBookingSync();
  const { control, watch, setValue } = useFormContext<BookingFormValues>();
  const device = watch('device');
  const players = watch('players');
  const tier = watch('tier');
  const date = watch('date');
  const startTime = watch('startTime');
  const duration = watch('duration');
  const { data: cafeSettings } = useCafeSettings();
  const {
    data: stations = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['stations', device, tier, date, startTime, duration],
    queryFn: () =>
      fetchStations(device!, tier, date, startTime, duration, cafeSettings!),
    enabled: !!device && !!date && !!startTime && !!duration && !!cafeSettings,
    staleTime: 0,
    refetchInterval: 10_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const sortedStations = useMemo(
    () =>
      [...stations].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      ),
    [stations],
  );

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
            {sortedStations.map((station) => {
              const selected = station.isCombo
                ? field.value === station.comboStationIds?.[0]
                : field.value === station.id;

              const rate = station.isCombo
                ? station.hourly_rate // already the combined total
                : cafeSettings
                  ? getDisplayRate({
                      device,
                      players,
                      tier,
                      fallbackRate: station.hourly_rate,
                      settings: cafeSettings,
                    })
                  : 0;

              const isMaintenance =
                station.operational_status === 'maintenance';
              const isBookedForSlot = !!station.conflictUntil;
              const isDisabled = isMaintenance || isBookedForSlot;

              const statusLabel = isMaintenance
                ? 'Under maintenance'
                : isBookedForSlot
                  ? `Booked until ${formatTime(station.conflictUntil!)}`
                  : 'Available';

              const statusColor =
                isMaintenance || isBookedForSlot
                  ? 'text-red-500'
                  : 'text-green-400';

              const handleSelect = () => {
                if (station.isCombo && station.comboStationIds) {
                  const [primaryId, secondaryId] = station.comboStationIds;
                  field.onChange(primaryId);
                  setValue('linkedStationId', secondaryId, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                } else {
                  field.onChange(station.id);
                  setValue('linkedStationId', null, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }
              };

              return (
                <button
                  key={station.id}
                  type='button'
                  disabled={isDisabled}
                  onClick={handleSelect}
                  className={[
                    'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
                    selected
                      ? 'border-cyan-400 bg-cyan-400/10 text-white'
                      : 'border-cyan-400/40 text-cyan-300',
                    isDisabled
                      ? 'cursor-not-allowed opacity-50 border-white/10 bg-white/5'
                      : 'hover:border-cyan-400 hover:bg-cyan-400/5',
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
                    <div
                      className={`flex items-center justify-end gap-1 text-xs ${statusColor}`}
                    >
                      <span
                        className={[
                          'h-2 w-2 rounded-full',
                          isMaintenance || isBookedForSlot
                            ? 'bg-red-500'
                            : 'bg-green-400',
                        ].join(' ')}
                      />
                      <span>{statusLabel}</span>
                    </div>
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
