import { useFormContext } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { Field, FieldError } from '@/components/ui/field';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { VrIcon, PsIcon, RacingSimIcon, PcIcon } from '@/components/svgs';
import CardsReveal from '@/components/gsap/CardReveal';

const DEVICES = [
  { value: 'pc', label: 'PC gaming', sublabel: 'High-end PCs', icon: PcIcon },
  { value: 'ps5', label: 'PS5', sublabel: 'PlayStation 5', icon: PsIcon },
  { value: 'vr', label: 'PS VR2', sublabel: 'Virtual reality', icon: VrIcon },
  {
    value: 'racing',
    label: 'Racing sim',
    sublabel: 'Racing experience',
    icon: RacingSimIcon,
  },
] as const;

type DeviceStepProps = {
  formCardRef: React.RefObject<HTMLElement | null>;
  isFirstReveal: boolean;
};

export default function DeviceStep({ formCardRef, isFirstReveal }: DeviceStepProps) {
  const { control } = useFormContext();
  // const gridRef = useRef<HTMLDivElement>(null);
    const gridWrapperRef = useRef<HTMLDivElement>(null);


  // useGSAP(
  //   () => {
  //     if (!gridRef.current) return;
  //     const cards = Array.from(gridRef.current.children) as HTMLElement[];

  //     if (!isFirstReveal) {
  //       // Revisiting step 1 later — no scroll gating needed, just land instantly
  //       gsap.set(cards, { autoAlpha: 1, y: 0 });
  //       onRevealComplete?.();
  //       return;
  //     }

  //     // First time seeing step 1 — stay hidden until the parent card has
  //     // actually faded in (canAnimate flips true from BookingForm's onComplete)
  //     gsap.set(cards, { autoAlpha: 0, y: 24 });

  //     if (!canAnimate) return;

  //     gsap.to(cards, {
  //       autoAlpha: 1,
  //       y: 0,
  //       duration: 0.4,
  //       stagger: 0.1,
  //       ease: 'power4.out',
  //       onComplete: onRevealComplete,
  //     });
  //   },
  //   { scope: gridRef, dependencies: [canAnimate, isFirstReveal] },
  // );

  // useGSAP(
  //   () => {
  //     if (!gridRef.current) return;
  //     const cards = Array.from(gridRef.current.children) as HTMLElement[];

  //     if (isFirstReveal) {
  //       gsap.set(cards, { autoAlpha: 0, y: 24 });
  //       gsap.to(cards, {
  //         autoAlpha: 1,
  //         y: 0,
  //         duration: 0.4,
  //         stagger: 0.1,
  //         ease: 'power4.out',
  //         onComplete: onRevealComplete,
  //       });
  //     } else {
  //       // Revisiting step 1 — StepTransition's slide is the only motion needed
  //       gsap.set(cards, { autoAlpha: 1, y: 0 });
  //       onRevealComplete?.();
  //     }
  //   },
  //   { scope: gridRef, dependencies: [isFirstReveal] },
  // );
  if(!isFirstReveal) {
    return (
      <Controller
        name='device'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            {/* <FieldLabel htmlFor='device'>
                What would you like to play on?
              </FieldLabel> */}
            <div
              ref={gridWrapperRef}
              className='grid grid-cols-2 gap-3 booking-station-grid'
            >
              {DEVICES.map(({ value, label, sublabel, icon: Icon }) => {
                const selected = field.value === value;
                return (
                  <button
                    key={value}
                    type='button'
                    onClick={() => field.onChange(value)}
                    aria-pressed={selected}
                    aria-invalid={fieldState.invalid}
                    className={[
                      'cursor-pointer min-h-40 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-colors hover:border-cyan-400 hover:bg-cyan-400/5',
                      selected
                        ? 'border-cyan-400 bg-cyan-400/10 text-white'
                        : 'border-cyan-400/40 text-cyan-300',
                    ].join(' ')}
                    // className={[
                    //   'cursor-pointer min-h-40 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all hover:border-cyan-400 hover:bg-cyan-400/5',
                    //   selected
                    //     ? 'border-cyan-400 bg-cyan-400/10 text-white'
                    //     : 'border-cyan-400/40 text-cyan-300',
                    // ].join(' ')}
                  >
                    <Icon className='h-8 w-8 text-white' />
                    <span className='text-sm font-semibold text-white'>
                      {label}
                    </span>
                    <span className='text-xs text-white/50'>{sublabel}</span>
                  </button>
                );
              })}
            </div>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    )
  }

  return (
    <Controller
      name='device'
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {/* <FieldLabel htmlFor='device'>
              What would you like to play on?
            </FieldLabel> */}
            <CardsReveal triggerRef={formCardRef} delay={0.3} stagger={0.1}>
              <div
                ref={gridWrapperRef}
                className='grid grid-cols-2 gap-3 booking-station-grid'
              >
                {DEVICES.map(({ value, label, sublabel, icon: Icon }) => {
                  const selected = field.value === value;
                  return (
                    <button
                      key={value}
                      type='button'
                      onClick={() => field.onChange(value)}
                      aria-pressed={selected}
                      aria-invalid={fieldState.invalid}
                      className={[
                        'cursor-pointer min-h-40 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-colors hover:border-cyan-400 hover:bg-cyan-400/5',
                        selected
                          ? 'border-cyan-400 bg-cyan-400/10 text-white'
                          : 'border-cyan-400/40 text-cyan-300',
                      ].join(' ')}
                      // className={[
                      //   'cursor-pointer min-h-40 flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all hover:border-cyan-400 hover:bg-cyan-400/5',
                      //   selected
                      //     ? 'border-cyan-400 bg-cyan-400/10 text-white'
                      //     : 'border-cyan-400/40 text-cyan-300',
                      // ].join(' ')}
                    >
                      <Icon className='h-8 w-8 text-white' />
                      <span className='text-sm font-semibold text-white'>
                        {label}
                      </span>
                      <span className='text-xs text-white/50'>{sublabel}</span>
                    </button>
                  );
                })}
              </div>
            </CardsReveal>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
