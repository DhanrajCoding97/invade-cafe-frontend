// components/BookingForm/steps/SummaryStep.tsx
'use client';

import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';

async function fetchStationName(stationId: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('name')
    .eq('id', stationId)
    .single();
  if (error) throw error;
  return data.name;
}

interface SummaryStepProps {
  session: { id: string } | null;
  onGoogleLogin: () => void;
  onContinue: () => void; // advances to payment — only called when session exists
}

export default function SummaryStep({
  session,
  onGoogleLogin,
  onContinue,
}: SummaryStepProps) {
  const { watch } = useFormContext<BookingFormValues>();
  const values = watch();

  const { data: stationName, isLoading } = useQuery({
    queryKey: ['station-name', values.stationId],
    queryFn: () => fetchStationName(values.stationId),
    enabled: !!values.stationId,
  });

  const rate = getDisplayRate({
    device: values.device,
    players: values.players,
    tier: values.tier,
    fallbackRate: 0, // resolved server-side/at payment too — display-only here
  });
  const total = calculateTotal(rate, values.duration);

  const rows = [
    { label: 'Device', value: values.device?.toUpperCase() },
    { label: 'Station', value: isLoading ? '…' : stationName },
    { label: 'Date', value: values.date ? format(values.date, 'PPP') : '—' },
    { label: 'Time', value: values.startTime },
    {
      label: 'Duration',
      value: `${values.duration} hr${values.duration !== 1 ? 's' : ''}`,
    },
    ...(values.device === 'ps5'
      ? [{ label: 'Players', value: String(values.players ?? 1) }]
      : []),
    ...(values.device === 'racing'
      ? [
          {
            label: 'Mode',
            value:
              values.tier === 'multiplayer' ? 'Multiplayer' : 'Single Player',
          },
        ]
      : []),
  ];

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-white'>Review your booking</h3>

      <div className='space-y-2 rounded-xl border border-white/10 p-4'>
        {rows.map((row) => (
          <div key={row.label} className='flex justify-between text-sm'>
            <span className='text-white/50'>{row.label}</span>
            <span className='text-white'>{row.value}</span>
          </div>
        ))}
        <div className='mt-2 flex justify-between border-t border-white/10 pt-2 text-base font-bold'>
          <span className='text-white'>Total</span>
          <span className='text-cyan-400'>₹{total}</span>
        </div>
      </div>

      {session ? (
        <button
          type='button'
          onClick={onContinue}
          className='w-full rounded-lg bg-cyan-400 px-4 py-3 font-semibold text-black'
        >
          Continue to Payment
        </button>
      ) : (
        <button
          type='button'
          onClick={onGoogleLogin}
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-black'
        >
          Sign in with Google to Continue
        </button>
      )}
    </div>
  );
}
