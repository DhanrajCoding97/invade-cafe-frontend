'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingFormSkeleton } from '../skeletons/BookingSkeleton';
import { SubmitHandler, useForm } from 'react-hook-form';
import { FormProvider } from 'react-hook-form';
import { createClient } from '@/lib/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import DeviceStep from './steps/DeviceStep';
import OptionsStep from './steps/OptionsStep';
import StationStep from './steps/StationStep';
import DateTimeStep from './steps/DateTimeStep';
import SummaryStep from './steps/SummaryStep';
import PaymentStep from './steps/PaymentStep';
import ConfirmedStep from './steps/ConfirmedStep';
import {
  clearBookingDraft,
  loadBookingDraft,
  saveBookingDraft,
} from '@/lib/bookingDraft';
import {
  bookingSchema,
  type BookingFormValues,
} from '@/lib/schemas/BookingFormSchema';
import { handleOAuthLogin } from '@/lib/auth/oauth';
import { StepTransition } from './steps/StepTransition';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
// order matters - index = step number
export const STEPS = [
  'device',
  'options',
  'station',
  'datetime',
  'summary',
  'payment',
  'confirmed',
] as const;

export type Step = (typeof STEPS)[number];

function needsOptionsStep(device: BookingFormValues['device'] | undefined) {
  return device === 'ps5' || device === 'racing';
}

// Fields validated per step before "Next" is allowed
const STEP_FIELDS: Partial<Record<Step, (keyof BookingFormValues)[]>> = {
  device: ['device'],
  station: ['stationId'],
  datetime: ['date', 'startTime', 'duration'],
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
  const [isRestoring, setIsRestoring] = useState(true);
  const [direction, setDirection] = useState<1 | -1>(1);
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
  //get session on mount

  // useEffect(() => {
  //   async function restore() {
  //     const { data } = await supabase.auth.getSession();
  //     if (data.session) setSession({ id: data.session.user.id });
  //     const draft = loadBookingDraft();
  //     if (draft) {
  //       form.reset(draft.values);
  //       setStepIndex(STEPS.indexOf(draft.step));
  //       clearBookingDraft();
  //     }

  //     setIsRestoring(false);
  //   }
  //   restore();

  //   const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
  //     setSession(sess ? { id: sess.user.id } : null);
  //   });
  //   return () => sub.subscription.unsubscribe();
  // }, [supabase]);

  useEffect(() => {
    async function restore() {
      const { data } = await supabase.auth.getSession();
      if (data.session) setSession({ id: data.session.user.id });

      if (!deviceParam) {
        // no fresh deep link — safe to restore an interrupted draft (e.g. post-OAuth return)
        const draft = loadBookingDraft();
        if (draft) {
          form.reset(draft.values);
          setStepIndex(STEPS.indexOf(draft.step));
          clearBookingDraft();
        }
      } else {
        // fresh deep link takes priority — discard any stale draft
        clearBookingDraft();
      }

      setIsRestoring(false);
    }
    restore();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess ? { id: sess.user.id } : null);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  async function goNext() {
    if (step === 'options') {
      const device = form.getValues('device');
      const field =
        device === 'ps5' ? 'players' : device === 'racing' ? 'tier' : null;
      if (field) {
        const valid = await form.trigger(field);
        if (!valid) return;
      }
    } else {
      const fields = STEP_FIELDS[step];
      if (fields && !(await form.trigger(fields))) return;
    }

    let next = stepIndex + 1;
    const device = form.getValues('device');

    if (STEPS[next] === 'options' && !needsOptionsStep(device)) next++;
    // if (STEPS[next] === 'login' && session) next++;

    setStepIndex(next);
    setDirection(1);
    setStepIndex(next);
  }

  function goBack() {
    let prev = stepIndex - 1;
    const device = form.getValues('device');
    // if (STEPS[prev] === 'login' && session) prev--;
    if (STEPS[prev] === 'options' && !needsOptionsStep(device)) prev--;
    setDirection(-1);

    setStepIndex(Math.max(prev, 0));
  }

  async function handleGoogleLogin() {
    saveBookingDraft(form.getValues(), 'summary');
    await handleOAuthLogin('/#booking');
  }
  const currentDevice = form.watch('device');

  // gsap
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardRef.current) return;

      gsap.set(cardRef.current, { autoAlpha: 0, y: 40 });

      gsap.to(cardRef.current, {
        autoAlpha: 1,
        y: 0,
        delay: 1.2,
        duration: 0.8,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          once: true,
        },
      });
    },
    { scope: cardRef },
  );

  return (
    <div
      ref={cardRef}
      className='mt-8 w-full rounded-lg animate-rotate-border bg-conic/[from_var(--border-angle)] from-[#860f6c] via-[#2FF0FF] to-black p-px'
    >
      <div className='p-4 sm:p-6 lg:p-10 rounded-lg bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(254,17,255,0.06),transparent_60%)] bg-[#05070A]'>
        <FormProvider {...form}>
          {deviceFromUrl && step !== 'device' && (
            <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-white/70'>
              {currentDevice.toUpperCase()}
              {currentDevice === 'ps5' &&
                form.watch('players') &&
                ` · ${form.watch('players')} player${form.watch('players') !== 1 ? 's' : ''}`}
              <button
                type='button'
                onClick={() => setStepIndex(STEPS.indexOf('device'))}
                className='text-cyan-400'
              >
                change
              </button>
            </div>
          )}
          {isRestoring ? (
            <BookingFormSkeleton />
          ) : (
            <StepTransition stepKey={step} direction={direction}>
              {step === 'device' && <DeviceStep />}
              {step === 'options' && <OptionsStep />}
              {step === 'station' && <StationStep />}
              {step === 'datetime' && <DateTimeStep />}
              {step === 'summary' && (
                <SummaryStep
                  session={session}
                  onGoogleLogin={handleGoogleLogin}
                  onContinue={goNext}
                />
              )}
              {step === 'payment' && (
                <PaymentStep
                // submitting={submitting}
                // onPay={form.handleSubmit(handlePayment)}
                />
              )}
              {step === 'confirmed' && <ConfirmedStep />}
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
                  {step !== 'payment' && step !== 'summary' && (
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
            </StepTransition>
          )}
        </FormProvider>
      </div>
    </div>
  );
}
