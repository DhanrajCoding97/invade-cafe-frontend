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

async function fetchStations(
  device: string,
  tier: string | undefined,
  date: Date,
  startTime: string,
  duration: number,
): Promise<Station[]> {
  const supabase = createClient();

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
  const dateStr = format(date, 'yyyy-MM-dd');

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

  // VR-specific check: only one headset, shared across all PS5s
  if (device === 'vr') {
    const { data: vrData, error: vrError } = await supabase.rpc(
      'get_vr_conflict_for_slot',
      { p_date: dateStr, p_start_time: startTime, p_duration_hours: duration },
    );
    if (vrError) throw vrError;

    const vrConflictEnd = vrData?.[0]?.conflict_end ?? null;
    if (vrConflictEnd) {
      // headset is booked for this slot — every PS5 is effectively blocked for VR use
      return stations.map((s) => ({
        ...s,
        conflictUntil: vrConflictEnd,
      })) as Station[];
    }
  }

  return stations.map((s) => ({
    ...s,
    conflictUntil: conflictUntilByStation.get(s.id) ?? null,
  })) as Station[];
}

function getMinutesLeft(iso: string): number {
  return Math.max(
    1,
    Math.ceil((new Date(iso).getTime() - Date.now()) / 60_000),
  );
}

export default function StationStep() {
  useRealtimeBookingSync();
  const { control, watch } = useFormContext<BookingFormValues>();
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
    queryFn: () => fetchStations(device!, tier, date, startTime, duration),
    enabled: !!device && !!date && !!startTime && !!duration,
    staleTime: 0,
    refetchInterval: 10_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
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
              // const isMaintenance = station.status === 'maintenance';
              const rate =
                station && cafeSettings
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

              return (
                <button
                  key={station.id}
                  type='button'
                  disabled={isDisabled}
                  onClick={() => field.onChange(station.id)}
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
                    {/* <p className={`text-xs ${statusColor}`}>{statusLabel}</p> */}
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
