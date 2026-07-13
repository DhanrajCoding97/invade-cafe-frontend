// components/BookingForm/steps/OptionsStep.tsx
'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { type BookingFormValues } from '@/lib/schemas/BookingFormSchema';

export default function OptionsStep() {
  const { control, watch } = useFormContext<BookingFormValues>();
  const device = watch('device');

  // if (device === 'ps5') {
  //   return (
  //     <Controller
  //       name='players'
  //       control={control}
  //       render={({ field, fieldState }) => (
  //         <Field data-invalid={fieldState.invalid}>
  //           <FieldLabel>How many players?</FieldLabel>
  //           <div className='flex items-center justify-center gap-5'>
  //             <button
  //               type='button'
  //               onClick={() =>
  //                 field.onChange(Math.max(1, (field.value ?? 1) - 1))
  //               }
  //               disabled={(field.value ?? 1) <= 1}
  //               className='flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 disabled:opacity-30'
  //             >
  //               −
  //             </button>
  //             <span className='min-w-20 text-center text-base font-semibold text-white'>
  //               {field.value ?? 1} player{(field.value ?? 1) !== 1 ? 's' : ''}
  //             </span>
  //             <button
  //               type='button'
  //               onClick={() =>
  //                 field.onChange(Math.min(4, (field.value ?? 1) + 1))
  //               }
  //               disabled={(field.value ?? 1) >= 4}
  //               className='flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/70 disabled:opacity-30'
  //             >
  //               +
  //             </button>
  //           </div>
  //           {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
  //         </Field>
  //       )}
  //     />
  //   );
  // }

  if (device === 'ps5') {
    const OPTIONS = [
      { value: 1, label: '1 Player', rateLabel: '₹100/hr' },
      { value: 2, label: '2 Players', rateLabel: '₹160/hr' },
      { value: 3, label: '3 Players', rateLabel: '₹240/hr' },
      { value: 4, label: '4 Players', rateLabel: '₹300/hr' },
    ] as const;

    return (
      <Controller
        name='players'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>How many players?</FieldLabel>

            <div className='space-y-2'>
              {OPTIONS.map((option) => {
                const selected = field.value === option.value;

                return (
                  <button
                    key={option.value}
                    type='button'
                    onClick={() => field.onChange(option.value)}
                    className={[
                      'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
                      selected
                        ? 'border-cyan-400 bg-cyan-400/5'
                        : 'border-white/10 hover:border-white/25',
                    ].join(' ')}
                  >
                    <span className='text-sm font-semibold text-white'>
                      {option.label}
                    </span>

                    <span className='text-sm font-bold text-cyan-400'>
                      {option.rateLabel}
                    </span>
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

  if (device === 'racing') {
    const TIERS = [
      { value: 'single', label: 'Single Player', rateLabel: '₹150/hr' },
      { value: 'multiplayer', label: 'Multiplayer', rateLabel: '₹300/hr' },
    ] as const;

    return (
      <Controller
        name='tier'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Choose your mode</FieldLabel>
            <div className='space-y-2'>
              {TIERS.map((tier) => {
                const selected = field.value === tier.value;
                return (
                  <button
                    key={tier.value}
                    type='button'
                    onClick={() => field.onChange(tier.value)}
                    className={[
                      'flex w-full items-center justify-between rounded-xl border p-3 text-left transition-colors',
                      selected
                        ? 'border-cyan-400 bg-cyan-400/5'
                        : 'border-white/10 hover:border-white/25',
                    ].join(' ')}
                  >
                    <span className='text-sm font-semibold text-white'>
                      {tier.label}
                    </span>
                    <span className='text-sm font-bold text-cyan-400'>
                      {tier.rateLabel}
                    </span>
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

  // pc / vr never render this — shouldn't happen given the skip logic, but a safe fallback
  return null;
}
