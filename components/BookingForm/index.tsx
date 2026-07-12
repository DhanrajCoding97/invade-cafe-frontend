'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { FormProvider } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DeviceStep from './steps/DeviceStep';
import StationStep from './steps/StationStep';
import DateTimeStep from './steps/DateTimeStep';
import DurationStep from './steps/DurationStep';
import SummaryStep from './steps/SummaryStep';
import LoginStep from './steps/LoginStep';
import PaymentStep from './steps/PaymentStep';
import ConfirmedStep from './steps/ConfirmedStep';
import {
  bookingSchema,
  type BookingFormValues,
} from '@/lib/schemas/BookingFormSchema';

// order matters - index = step number
const STEPS = [
  'device',
  'station',
  'datetime',
  'duration',
  'summary',
  'login',
  'payment',
  'confirmed',
] as const;

type Step = (typeof STEPS)[number];
// Fields validated per step before "Next" is allowed
const STEP_FIELDS: Partial<Record<Step, (keyof BookingFormValues)[]>> = {
  device: ['device'],
  station: ['stationId'],
  datetime: ['date', 'startTime'],
  duration: ['duration'],
};

const DEVICE_MAP: Record<string, BookingFormValues['device']> = {
  pc: 'pc',
  ps5: 'ps5',
  vr: 'vr',
  racing: 'racing',
};

export default function BookingForm() {
  const searchParams = useSearchParams();
  const supabase = createClient();

  const deviceParam = searchParams.get('device');
  const playersParam = searchParams.get('players');
  const deviceFromUrl = deviceParam ? DEVICE_MAP[deviceParam] : undefined;

  const initialStep: Step = deviceFromUrl ? 'station' : 'device';
  const [stepIndex, setStepIndex] = useState(STEPS.indexOf(initialStep));
  const [session, setSession] = useState<{ id: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      device: deviceFromUrl,
      stationId: '',
      date: new Date(),
      startTime: '',
      duration: 1,
      players: playersParam ? Number(playersParam) : 1,
    },
  });

  const step = STEPS[stepIndex];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSession({ id: data.session.user.id });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ? { id: sess.user.id } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function goNext() {
    console.log('========== NEXT ==========');
    console.log('Current step:', step);

    console.log('Current values:');
    console.log(form.getValues());

    const fields = STEP_FIELDS[step];

    if (fields) {
      const valid = await form.trigger(fields);

      console.log('Fields being validated:', fields);
      console.log('Is valid:', valid);

      if (!valid) {
        console.log('Validation errors:');
        console.log(form.formState.errors);
        return;
      }
    }

    let next = stepIndex + 1;

    if (STEPS[next] === 'login' && session) {
      next++;
    }

    console.log('Going to:', STEPS[next]);

    setStepIndex(next);
  }

  function goBack() {
    let prev = stepIndex - 1;
    if (STEPS[prev] === 'login' && session) prev--;
    setStepIndex(Math.max(prev, 0));
  }
  return (
    <div className='mt-8 w-full rounded-lg animate-rotate-border bg-conic/[from_var(--border-angle)] from-black via-[#2FF0FF] to-black p-px'>
      <div className='p-10 rounded-lg bg-gray-950'>
        <FormProvider {...form}>
          {deviceFromUrl && step !== 'device' && (
            <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-white/70'>
              {deviceFromUrl.toUpperCase()}
              {playersParam &&
                ` · ${playersParam} player${playersParam !== '1' ? 's' : ''}`}
              <button
                type='button'
                onClick={() => setStepIndex(STEPS.indexOf('device'))}
                className='text-cyan-400'
              >
                change
              </button>
            </div>
          )}

          {step === 'device' && <DeviceStep />}
          {step === 'station' && <StationStep />}
          {step === 'datetime' && <DateTimeStep />}
          {step === 'duration' && <DurationStep />}
          {step === 'summary' && <SummaryStep />}
          {step === 'login' && (
            <LoginStep
            // onGoogleLogin={handleGoogleLogin}
            />
          )}
          {step === 'payment' && (
            <PaymentStep
            // submitting={submitting}
            // onPay={form.handleSubmit(handlePayment)}
            />
          )}
          {step === 'confirmed' && (
            <ConfirmedStep
            // onClose={() => onOpenChange(false)}
            />
          )}

          {step !== 'confirmed' && (
            <div className='mt-6 flex justify-between'>
              {stepIndex > 0 && (
                <button
                  type='button'
                  onClick={goBack}
                  className='text-white/60'
                >
                  Back
                </button>
              )}
              {step !== 'payment' && (
                <button
                  type='button'
                  onClick={goNext}
                  className='ml-auto rounded-lg bg-cyan-400 px-4 py-2 text-black'
                >
                  Next
                </button>
              )}
            </div>
          )}
        </FormProvider>
      </div>
    </div>
  );
}
