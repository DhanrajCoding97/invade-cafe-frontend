// components/BookingForm/steps/SummaryStep.tsx
'use client';
import { PhoneInput } from '@/components/ui/phone-input';
import { useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';
import { FcGoogle } from 'react-icons/fc';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import { cn } from '@/lib/utils';

import { useState } from 'react';
import { useProfile } from '@/hooks/use-profile';
import { useUpdatePhone } from '@/hooks/use-update-phone';
import { useCafeSettings } from '@/hooks/use-cafe-settings';

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
  onContinue: () => void;
  isSubmitting: boolean;
}

export default function SummaryStep({
  session,
  onGoogleLogin,
  onContinue,
  isSubmitting,
}: SummaryStepProps) {
  const { watch } = useFormContext<BookingFormValues>();
  const values = watch();
  const { data: cafeSettings } = useCafeSettings();

  //update profile with phone number
  const { data: profile, isLoading: profileLoading } = useProfile(session?.id);
  const updatePhone = useUpdatePhone();
  const [phoneInput, setPhoneInput] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  function handleSavePhone() {
    const trimmed = phoneInput.trim();
    if (!/^\+?[0-9]{10,15}$/.test(trimmed)) {
      setPhoneError('Enter a valid phone number');
      return;
    }
    setPhoneError(null);
    updatePhone.mutate({ userId: session!.id, phone: trimmed });
  }

  const needsPhone = !!session && !profileLoading && !profile?.phone;

  //fetch station
  const { data: stationName, isLoading } = useQuery({
    queryKey: ['station-name', values.stationId],
    queryFn: () => fetchStationName(values.stationId),
    enabled: !!values.stationId,
  });

  const rate = cafeSettings
    ? getDisplayRate({
        device: values.device,
        players: values.players,
        tier: values.tier,
        fallbackRate: 0,
        settings: cafeSettings,
      })
    : 0;
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
    <div className='flex flex-col gap-6'>
      <h3 className='text-lg font-semibold text-white'>Review your booking</h3>

      <div className='space-y-2 rounded-xl border border-cyan-400 p-4'>
        {rows.map((row) => (
          <div
            key={row.label}
            className='flex justify-between text-[clamp(0.8rem,2vw,1.125rem)] text-[#bcbcbc]'
          >
            <span className='text-white/50'>{row.label}</span>
            <span className='text-white'>{row.value}</span>
          </div>
        ))}
        <div className='mt-2 flex justify-between border-t border-white/10 pt-2 text-base font-bold'>
          <span className='text-white'>Total</span>
          <span className='text-cyan-400'>₹{total}</span>
        </div>
      </div>

      {/* {session ? (
        <CornerCutButton
          onClick={onContinue}
          variant='outline'
          className='ml-auto'
          size='sm'
        >
          Checkout
        </CornerCutButton>
      ) : (
        <CornerCutButton
          disabled={isSubmitting}
          onClick={onGoogleLogin}
          variant='ghost'
          className={cn(
            'ml-auto ',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isSubmitting && 'pointer-events-none',
          )}
          size='sm'
        >
          {!isSubmitting ? (
            <>
              Continue with <FcGoogle size={20} />
            </>
          ) : (
            <>Signin In..</>
          )}
        </CornerCutButton>
      )} */}
      {!session ? (
        <CornerCutButton
          disabled={isSubmitting}
          onClick={onGoogleLogin}
          variant='ghost'
          className={cn(
            'ml-auto',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isSubmitting && 'pointer-events-none',
          )}
          size='sm'
        >
          {!isSubmitting ? (
            <>
              Continue with <FcGoogle size={20} />
            </>
          ) : (
            <>Signin In..</>
          )}
        </CornerCutButton>
      ) : needsPhone ? (
        <div className='flex flex-col gap-2 rounded-xl border border-cyan-400/40 p-4'>
          <label htmlFor='phone' className='text-sm text-white/70'>
            Add your phone number to continue
          </label>

          <div className='flex flex-col gap-3 sm:flex-row'>
            <PhoneInput
              id='phone'
              placeholder='8454994242'
              defaultCountry='IN'
              value={phoneInput}
              onChange={setPhoneInput}
              className='flex-1'
            />

            <CornerCutButton
              onClick={handleSavePhone}
              disabled={updatePhone.isPending}
              variant='outline'
              size='sm'
            >
              {updatePhone.isPending ? 'Saving...' : 'Save'}
            </CornerCutButton>
          </div>

          {phoneError && <p className='text-xs text-red-400'>{phoneError}</p>}

          {updatePhone.isError && (
            <p className='text-xs text-red-400'>{updatePhone.error.message}</p>
          )}
        </div>
      ) : (
        <CornerCutButton
          onClick={onContinue}
          color='cyan'
          variant='outline'
          showArrow
          hoverEffect='shift'
          fullWidthOnMobile={true}
          className='ml-auto'
        >
          Checkout
        </CornerCutButton>
      )}
    </div>
  );
}
