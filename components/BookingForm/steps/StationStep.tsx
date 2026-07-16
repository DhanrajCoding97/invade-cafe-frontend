'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { createClient } from '@/lib/supabase/client';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';
import { getDisplayRate } from '@/lib/pricing';
import StationStepSkeleton from '@/components/skeletons/StationStepSkeleton';

interface Station {
  id: string;
  name: string;
  specs: Record<string, string> | null;
  hourly_rate: number;
  status: 'available' | 'booked' | 'maintenance';
}

async function fetchStations(
  device: string,
  tier?: string,
): Promise<Station[]> {
  const supabase = createClient();
  let query = supabase
    .from('stations')
    .select('id, name, specs, hourly_rate, max_players, status')
    .eq('type', device === 'vr' ? 'ps5' : device); // vr books a ps5 slot, handled separately below

  if (device === 'racing' && tier === 'multiplayer') {
    query = query.gte('max_players', 2);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export default function StationStep() {
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
    staleTime: 30_000, // stations don't change every second — 30s cache is plenty
  });

  if (isLoading)
    // return <p className='text-sm text-white/50'>Loading stations…</p>;
    return <StationStepSkeleton />;
  if (error)
    return <p className='text-sm text-red-400'>Couldn't load stations</p>;

  const STATUS_LABEL: Record<Station['status'], string> = {
    available: 'Available',
    booked: 'Booked',
    maintenance: 'Under maintenance',
  };
  const STATUS_COLOR: Record<Station['status'], string> = {
    available: 'text-green-400',
    booked: 'text-amber-400',
    maintenance: 'text-red-600',
  };

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
              const disabled = station.status !== 'available';
              const rate = getDisplayRate({
                device,
                players,
                tier,
                fallbackRate: station.hourly_rate,
              });

              return (
                <button
                  key={station.id}
                  type='button'
                  disabled={disabled}
                  onClick={() => field.onChange(station.id)}
                  className={[
                    'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
                    selected
                      ? 'border-cyan-400 bg-cyan-400/10 text-white'
                      : 'border-cyan-400/40 text-cyan-300',
                    disabled
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
                    <p className={`text-xs ${STATUS_COLOR[station.status]}`}>
                      {STATUS_LABEL[station.status]}
                    </p>
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
