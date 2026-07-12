// components/BookingForm/steps/StationStep.tsx
'use client';

import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { createClient } from '@/lib/supabase/client';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';

interface Station {
  id: string;
  name: string;
  specs: Record<string, string> | null;
  hourly_rate: number;
  status: 'available' | 'booked' | 'maintenance';
}

export default function StationStep() {
  const { control, watch } = useFormContext<BookingFormValues>();
  const device = watch('device');

  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!device) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    supabase
      .from('stations')
      .select('id, name, specs, hourly_rate, status')
      .eq('type', device)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
        } else {
          setStations(data ?? []);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [device]);

  if (loading) {
    return <p className='text-sm text-white/50'>Loading stations…</p>;
  }

  if (error) {
    return (
      <p className='text-sm text-red-400'>Couldn't load stations: {error}</p>
    );
  }

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
              return (
                <button
                  key={station.id}
                  type='button'
                  disabled={disabled}
                  onClick={() => field.onChange(station.id)}
                  aria-pressed={selected}
                  className={[
                    'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
                    selected
                      ? 'border-cyan-400 bg-cyan-400/5'
                      : 'border-white/10',
                    disabled
                      ? 'cursor-not-allowed opacity-40'
                      : 'hover:border-white/25',
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
                      ₹{station.hourly_rate}/hr
                    </p>
                    <p className='text-xs text-white/40'>
                      {disabled ? 'Booked' : 'Available'}
                    </p>
                  </div>
                </button>
              );
            })}
            {stations.length === 0 && (
              <p className='text-sm text-white/50'>
                No stations found for this device.
              </p>
            )}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
