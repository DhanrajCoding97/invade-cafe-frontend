'use client';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { BookingFormSkeleton } from '../skeletons/BookingSkeleton';
import { useForm } from 'react-hook-form';
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
import dynamic from 'next/dynamic';
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
// const CornerCutButton = dynamic(
//   () => import('@/app/components/neonblade-ui/corner-cut-button'),
//   {
//     ssr: false,
//   },
// );
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
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

gsap.registerPlugin(ScrollToPlugin);

export const STEPS = [
  'device',
  'options',
  'datetime',
  'station',
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
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const deviceParam = searchParams.get('device');
  const playersParam = searchParams.get('players')?.toLowerCase();
  const tierParam = searchParams.get('tier')?.toLowerCase();
  const deviceFromUrl = deviceParam ? DEVICE_MAP[deviceParam] : undefined;

  const initialStep: Step = deviceFromUrl ? 'datetime' : 'device';
  const [stepIndex, setStepIndex] = useState(STEPS.indexOf(initialStep));
  const [session, setSession] = useState<{ id: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [cardsReady, setCardsReady] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      device: deviceFromUrl,
      stationId: '',
      date: new Date(),
      startTime: '',
      duration: 1,
      players: playersParam ? Number(playersParam) : undefined,
      tier: tierParam
        ? (tierParam.toLowerCase() as 'single' | 'multiplayer')
        : undefined,
    },
  });

  const step = STEPS[stepIndex];

  //url params form step skip
  const appliedDeviceParamRef = useRef<string | null>(null);
  const formTopRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!deviceParam) return;
    if (appliedDeviceParamRef.current === deviceParam) return; // already applied this exact link

    const device = DEVICE_MAP[deviceParam];
    if (!device) return;

    clearBookingDraft(); // fresh deep link always wins over a stale draft

    form.reset({
      ...form.getValues(),
      device,
      players: playersParam ? Number(playersParam) : undefined,
      tier: tierParam
        ? (tierParam.toLowerCase() as 'single' | 'multiplayer')
        : undefined,
    });

    const hasOptions =
      (device === 'ps5' && !!playersParam) ||
      (device === 'racing' && !!tierParam);

    const target =
      needsOptionsStep(device) && !hasOptions ? 'device' : 'datetime';
    setStepIndex(STEPS.indexOf(target));
    setDirection(1);

    appliedDeviceParamRef.current = deviceParam;
  }, [deviceParam, playersParam, tierParam]);

  //get session on mount
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

  useEffect(() => {
    if (!cardRef.current) return;

    gsap.set(cardRef.current, { autoAlpha: 0, y: 24 });

    gsap.to(cardRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: 'power4.out',
    });
  }, []);

  function scrollToForm() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!formTopRef.current) return;

        gsap.to(window, {
          duration: 0.6,
          ease: 'power2.out',
          scrollTo: {
            y: formTopRef.current,
            offsetY: 80,
          },
        });
      });
    });
  }
  async function goNext() {
    if (isNextLoading) return;

    setIsNextLoading(true);

    try {
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

      if (STEPS[next] === 'options' && !needsOptionsStep(device)) {
        next++;
      }

      // if (STEPS[next] === 'login' && session) next++;

      setStepIndex(next);
      setDirection(1);
      scrollToForm();
    } finally {
      setIsNextLoading(false);
    }
  }

  function goBack() {
    let prev = stepIndex - 1;
    const device = form.getValues('device');
    // if (STEPS[prev] === 'login' && session) prev--;
    if (STEPS[prev] === 'options' && !needsOptionsStep(device)) prev--;
    setDirection(-1);

    setStepIndex(Math.max(prev, 0));
    scrollToForm();
  }

  async function handleGoogleLogin() {
    try {
      saveBookingDraft(form.getValues(), 'summary');
      setSubmitting(true);
      await handleOAuthLogin('/#booking');
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  }
  const currentDevice = form.watch('device');

  const deviceLandingSyncedRef = useRef(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const deviceCardsRef = useRef<HTMLElement[] | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const deviceTweenAddedRef = useRef(false);
  const hasRevealedDeviceStep = useRef(false);
  const hasMounted = useRef(false);

  const isConfirmed = STEPS[stepIndex] === 'confirmed';

  function revealNextButton() {
    if (!buttonContainerRef.current) return;
    gsap.to(buttonContainerRef.current, {
      autoAlpha: 1,
      y: 0,
      duration: 0.4,
      ease: 'power4.out',
    });
  }

  return (
    <div
      ref={cardRef}
      className='mt-8 md:mt-10 lg:mt-12 w-full rounded-lg animate-rotate-border bg-conic/[from_var(--border-angle)] from-[#860f6c] via-[#2FF0FF] to-black p-px'
    >
      <div
        ref={formTopRef}
        className='p-4 sm:p-6 lg:p-8 rounded-lg bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(254,17,255,0.06),transparent_60%)] bg-[#05070A]'
      >
        <FormProvider {...form}>
          {deviceFromUrl && step !== 'device' && (
            <div className='mb-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-white/70'>
              {currentDevice.toUpperCase()}
              {currentDevice === 'ps5' &&
                form.watch('players') &&
                ` · ${form.watch('players')} player${form.watch('players') !== 1 ? 's' : ''}`}
              {!isConfirmed && (
                <button
                  type='button'
                  onClick={() => setStepIndex(STEPS.indexOf('device'))}
                  className='text-cyan-400'
                >
                  change
                </button>
              )}
            </div>
          )}
          {isRestoring ? (
            <BookingFormSkeleton />
          ) : (
            <>
              <StepTransition stepKey={step} direction={direction}>
                {step === 'device' && (
                  <DeviceStep
                    formCardRef={cardRef}
                    isFirstReveal={!hasRevealedDeviceStep.current}
                  />
                )}
                {step === 'options' && <OptionsStep />}
                {step === 'station' && conflictMessage && (
                  <div className='mb-4 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-300'>
                    {conflictMessage}
                  </div>
                )}
                {step === 'station' && <StationStep />}
                {step === 'datetime' && <DateTimeStep />}
                {step === 'summary' && (
                  <SummaryStep
                    session={session}
                    onGoogleLogin={handleGoogleLogin}
                    onContinue={goNext}
                    isSubmitting={submitting}
                  />
                )}
                {step === 'payment' && (
                  <PaymentStep
                    onPaymentSuccess={(id) => {
                      setBookingId(id);
                      setDirection(1);
                      setStepIndex((i) => i + 1);
                    }}
                    onSlotConflict={(message) => {
                      // Keep all booking details except the station
                      form.setValue('stationId', '');

                      // Go back to Station selection
                      setDirection(-1);
                      setStepIndex(STEPS.indexOf('station'));

                      setConflictMessage(message);

                      // Refresh station availability for the selected date/time
                      queryClient.invalidateQueries({
                        queryKey: [
                          'stations',
                          form.getValues('device'),
                          form.getValues('tier'),
                        ],
                      });

                      queryClient.invalidateQueries({
                        queryKey: [
                          'bookings',
                          format(form.getValues('date'), 'yyyy-MM-dd'),
                        ],
                      });
                    }}
                  />
                )}
                {step === 'confirmed' && (
                  <ConfirmedStep bookingId={bookingId} />
                )}
                {step !== 'confirmed' && (
                  <div
                    ref={buttonContainerRef}
                    className='mt-auto flex justify-between'
                  >
                    {stepIndex > 0 && (
                      <CornerCutButton
                        type='button'
                        size='xs'
                        onClick={goBack}
                        color='cyan'
                        variant='ghost'
                        showArrow
                        arrowDirection='left'
                        hoverEffect='shift'
                        fullWidthOnMobile={false}
                      >
                        Back
                      </CornerCutButton>
                    )}
                    {step !== 'payment' && step !== 'summary' && (
                      <CornerCutButton
                        className='ml-auto'
                        size='xs'
                        type='button'
                        disabled={isNextLoading}
                        onClick={goNext}
                        color='cyan'
                        variant='ghost'
                        showArrow
                        hoverEffect='shift'
                        fullWidthOnMobile={false}
                      >
                        {isNextLoading ? 'Processing…' : `Next`}
                      </CornerCutButton>
                    )}
                  </div>
                )}
              </StepTransition>
            </>
          )}
        </FormProvider>
      </div>
    </div>
  );
}
