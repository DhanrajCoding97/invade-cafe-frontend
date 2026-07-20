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
import { useQueryClient } from '@tanstack/react-query';
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

interface BookingFormProps {
  timeline?: gsap.core.Timeline;
  onReady?: () => void;
}

export default function ({ timeline, onReady }: BookingFormProps) {
  const queryClient = useQueryClient();
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
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [conflictMessage, setConflictMessage] = useState<string | null>(null);
  const [cardsReady, setCardsReady] = useState(false);
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      device: deviceFromUrl,
      stationId: '',
      date: new Date(),
      startTime: '',
      duration: 1,
      players: playersParam ? Number(playersParam) : undefined,
    },
  });

  const step = STEPS[stepIndex];

  //url params form step skip
  const appliedDeviceParamRef = useRef<string | null>(null);

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
    });

    const target =
      needsOptionsStep(device) && !playersParam ? 'device' : 'station';
    // if player count came in via URL, options step is already satisfied — skip straight to station
    setStepIndex(STEPS.indexOf(target));
    setDirection(1);

    appliedDeviceParamRef.current = deviceParam;
  }, [deviceParam, playersParam]);

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
  // useGSAP(
  //   () => {
  //     if (!cardRef.current) return;
  //     if (timeline) {
  //       timeline.fromTo(
  //         cardRef.current,
  //         { autoAlpha: 0, y: 40 },
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           duration: 0.8,
  //           ease: 'power4.out',
  //           onComplete: () => setCardVisible(true),
  //         },
  //         '-=0.2',
  //       );
  //       onReady?.(); // <-- tell parent this tween is now registered
  //     } else {
  //       // fallback: independent scroll-triggered reveal if no shared timeline provided
  //       gsap.fromTo(
  //         cardRef.current,
  //         { autoAlpha: 0, y: 40 },
  //         {
  //           autoAlpha: 1,
  //           y: 0,
  //           duration: 0.8,
  //           ease: 'power4.out',
  //           onComplete: () => setCardVisible(false),
  //           scrollTrigger: {
  //             trigger: cardRef.current,
  //             start: 'top 80%',
  //             once: true,
  //           },
  //         },
  //       );
  //     }
  //   },
  //   { scope: cardRef },
  // );

  // useGSAP(
  //   () => {
  //     if (!cardRef.current) return;

  //     if (timeline && !deviceSyncedRef.current) {
  //       timeline
  //         .fromTo(
  //           cardRef.current,
  //           { autoAlpha: 0, y: 40 },
  //           {
  //             autoAlpha: 1,
  //             y: 0,
  //             duration: 0.8,
  //             ease: 'power4.out',
  //             onComplete: () => setCardVisible(true),
  //           },
  //           '-=0.2',
  //         )
  //         .addLabel('formCardIn'); // marks the end of the tween just added

  //       if (deviceCardsRef.current) {
  //         timeline.to(
  //           deviceCardsRef.current,
  //           {
  //             autoAlpha: 1,
  //             y: 0,
  //             duration: 0.5,
  //             ease: 'power4.out',
  //             stagger: 0.08,
  //           },
  //           'formCardIn+=0.1',
  //         );
  //       }

  //       deviceSyncedRef.current = true;
  //       onReady?.(); // now called after the FULL sequence is registered
  //     } else {
  //       // Fallback: no shared timeline (or already synced once) — just
  //       // reveal the card shell on its own.
  //       gsap.fromTo(
  //         cardRef.current,
  //         { autoAlpha: 0, y: 40 },
  //         { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power4.out' },
  //       );
  //     }
  //   },
  //   { scope: cardRef, dependencies: [timeline] },
  // );
  // useGSAP(
  //   () => {
  //     if (!cardRef.current) return;

  //     if (timeline) {
  //       timeline
  //         .fromTo(
  //           cardRef.current,
  //           { autoAlpha: 0, y: 40 },
  //           {
  //             autoAlpha: 1,
  //             y: 0,
  //             duration: 0.8,
  //             ease: 'power4.out',
  //             onComplete: () => setCardVisible(true),
  //           },
  //           '-=0.2',
  //         )
  //         .addLabel('formCardIn');

  //         onReady?.()

  //       // Idempotent: only ever add the device stagger tween once, and only
  //       // once we actually have a non-empty array of card elements.
  //       if (!deviceTweenAddedRef.current && deviceCardsRef.current?.length) {
  //         timeline.to(
  //           deviceCardsRef.current,
  //           {
  //             autoAlpha: 1,
  //             y: 0,
  //             duration: 0.5,
  //             ease: 'power4.out',
  //             stagger: 0.08,
  //           },
  //           'formCardIn+=0.1',
  //         );
  //         deviceTweenAddedRef.current = true;
  //       }

  //       onReady?.();
  //     } else {
  //       gsap.fromTo(
  //         cardRef.current,
  //         { autoAlpha: 0, y: 40 },
  //         { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power4.out' },
  //       );
  //     }
  //     return () => {
  //       deviceTweenAddedRef.current = false;
  //     };
  //   },
  //   { scope: cardRef, dependencies: [timeline] },
  // );

  // useGSAP(
  //   () => {
  //     if (!cardRef.current) return;

  //     if (timeline) {
  //       timeline
  //         .fromTo(
  //           cardRef.current,
  //           { autoAlpha: 0, y: 40 },
  //           {
  //             autoAlpha: 1,
  //             y: 0,
  //             duration: 0.8,
  //             ease: 'power4.out',
  //             onComplete: () => setCardVisible(true),
  //           },
  //           '-=0.2',
  //         )
  //         .addLabel('formCardIn')
  //         .fromTo(
  //           nextButtonRef.current,
  //           { autoAlpha: 0, y: 20 },
  //           { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
  //           '+=0.3',
  //         );

  //       // Do NOT add device stagger here – wait for cardsReady
  //       onReady?.();
  //     } else {
  //       // fallback when no shared timeline (standalone)
  //       gsap.fromTo(
  //         cardRef.current,
  //         { autoAlpha: 0, y: 40 },
  //         { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power4.out' },
  //       )
  //     }
  //   },
  //   { scope: cardRef, dependencies: [timeline] },
  // );

  // // 2️⃣ Effect that runs when cards are ready
  // useGSAP(
  //   () => {
  //     if (!timeline || !cardsReady || !deviceCardsRef.current?.length) return;
  //     if (deviceTweenAddedRef.current) return; // safety

  //     timeline.to(
  //       deviceCardsRef.current,
  //       {
  //         autoAlpha: 1,
  //         y: 0,
  //         duration: 0.5,
  //         ease: 'power4.out',
  //         stagger: 0.08,
  //       },
  //       'formCardIn+=0.1',
  //     );

  //     deviceTweenAddedRef.current = true;
  //   },
  //   { dependencies: [timeline, cardsReady] },
  // );

  useGSAP(
    () => {
      if (!cardRef.current) return;

      if (timeline) {
        timeline
          .fromTo(
            cardRef.current,
            { autoAlpha: 0, y: 40 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: 'power4.out',
              onComplete: () => setCardVisible(true),
            },
            '-=0.2',
          )
          .addLabel('formCardIn');

        onReady?.();
      } else {
        gsap.fromTo(
          cardRef.current,
          { autoAlpha: 0, y: 40 },
          { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power4.out' },
        );
      }
    },
    { scope: cardRef, dependencies: [timeline] },
  );

  // Runs once device cards are actually available — guarantees the button
  // tween is added AFTER the device stagger tween exists in `tl`.
  useGSAP(
    () => {
      if (!timeline || !deviceCardsRef.current?.length) return;
      if (deviceLandingSyncedRef.current) return;
      if (!deviceTweenAddedRef.current) {
        timeline
          .to(
            deviceCardsRef.current,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: 'power4.out',
              stagger: 0.08,
            },
            'formCardIn+=0.1',
          )
          .addLabel('deviceCardsIn'); // marks end of the stagger

        deviceTweenAddedRef.current = true;
      }

      if (nextButtonRef.current) {
        timeline.fromTo(
          nextButtonRef.current,
          { autoAlpha: 0, y: 20 },
          { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power4.inOut' },
          'deviceCardsIn+=0.01',
        );
      }
      deviceLandingSyncedRef.current = true;

      return () => {
        deviceTweenAddedRef.current = false;
      };
    },
    { scope: cardRef, dependencies: [timeline, cardsReady] },
  );

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
      className='mt-8 w-full rounded-lg animate-rotate-border bg-conic/[from_var(--border-angle)] from-[#860f6c] via-[#2FF0FF] to-black p-px'
    >
      <div className='p-4 sm:p-6 lg:p-8 rounded-lg bg-[radial-gradient(ellipse_at_top_left,rgba(0,212,255,0.08),transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(254,17,255,0.06),transparent_60%)] bg-[#05070A]'>
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
              {step === 'device' && (
                <DeviceStep
                  hasSharedTimeline={
                    !!timeline && !deviceLandingSyncedRef.current
                  }
                  onCardsReady={(cards) => {
                    deviceCardsRef.current = cards;
                    setCardsReady(true);
                  }}
                  onRevealComplete={
                    stepIndex === STEPS.indexOf('device')
                      ? revealNextButton
                      : undefined
                  }
                />
              )}
              {step === 'options' && <OptionsStep />}
              {step === 'station' && <StationStep />}
              {step === 'datetime' && conflictMessage && (
                <div className='mb-4 rounded-lg border border-amber-400/40 bg-amber-400/10 p-3 text-sm text-amber-300'>
                  {conflictMessage}
                </div>
              )}
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
                    setStepIndex((i) => i + 1); // advance to confirmation
                    setDirection(1);
                  }}
                  onSlotConflict={(message) => {
                    setDirection(-1);
                    setStepIndex(STEPS.indexOf('datetime'));
                    form.setValue('startTime', '');
                    setConflictMessage(message);
                    queryClient.invalidateQueries({
                      queryKey: ['bookings', form.getValues('stationId')],
                    });
                    queryClient.invalidateQueries({ queryKey: ['stations'] });
                  }}
                />
              )}
              {step === 'confirmed' && <ConfirmedStep bookingId={bookingId} />}
              {step !== 'confirmed' && (
                <div
                  ref={buttonContainerRef}
                  className='mt-auto flex justify-between'
                >
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
                      ref={nextButtonRef}
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
