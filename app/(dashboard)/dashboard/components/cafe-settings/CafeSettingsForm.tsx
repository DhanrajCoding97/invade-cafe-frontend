'use client';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings2 } from 'lucide-react';
import { toast } from 'sonner';
import { type CafeSettingsForm } from '@/types';
import {
  fetchCafeSettings,
  updateCafeSettings,
} from '@/lib/queries/cafe-settings';
import { WheelTimePicker } from '@/components/wheel-picker-time-input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CafeSettingsSkeleton } from '@/components/skeletons/CafeSettingsSkeleton';
// function FieldLabel({ children }: { children: React.ReactNode }) {
//   return (
//     <label className='block text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2'>
//       {children}
//     </label>
//   );
// }

const microLabel =
  'font-mono text-[9px] uppercase tracking-widest text-[#28F1FF]/60';
const fieldCls =
  'h-11 rounded-none border-[#28F1FF]/15 bg-[#070a0c] px-4 text-sm text-white ' +
  'placeholder:text-white/20 focus-visible:border-[#28F1FF] focus-visible:ring-1 ' +
  'focus-visible:ring-[#28F1FF]/40 disabled:opacity-40';

function TextInput({
  register,
  name,
  prefix,
  step,
}: {
  register: any;
  name: keyof CafeSettingsForm;
  prefix?: string;
  step?: string;
}) {
  return (
    <div className='relative'>
      {prefix && (
        <span className='absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/60 font-mono text-sm'>
          {prefix}
        </span>
      )}
      <input
        {...register(name, { valueAsNumber: !!step || undefined })}
        type={step ? 'number' : 'text'}
        step={step}
        className={`w-full bg-black/60 border border-cyan-500/20 rounded-md py-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors ${
          prefix ? 'pl-7 pr-3' : 'px-3'
        }`}
      />
    </div>
  );
}

export default function CafeSettingsForm() {
  const [timeOpen, setTimeOpen] = useState(false);
  const [closeTimeOpen, setCloseTimeOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cafe-settings'],
    queryFn: fetchCafeSettings,
  });

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<CafeSettingsForm>({
    values: data,
  });

  const mutation = useMutation({
    mutationFn: updateCafeSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cafe-settings'] });
      toast.success('Cafe settings updated');
    },
    onError: (err) => toast.error(err.message),
  });

  if (isLoading) {
    return <CafeSettingsSkeleton />;
  }

  return (
    <div className='@container w-full sm:max-w-4xl bg-[#080a0d] border border-cyan-500/10 rounded-2xl overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-3 sm:px-5 lg:px-6 py-5 border-b border-cyan-500/10'>
        <div className='flex items-center gap-3'>
          <div className='h-8 w-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center'>
            <Settings2 size={16} className='text-cyan-400' />
          </div>
          <div>
            <h2 className='font-mono text-xs sm:text-sm text-white tracking-wider font-semibold'>
              CAFE_SETTINGS
            </h2>
            <p className='font-mono text-[10px] text-white/40 tracking-wide'>
              OWNER_ACCESS_ONLY
            </p>
          </div>
        </div>
        <span className='font-mono text-[9px] sm:text-[10px] text-white/50 border border-white/15 rounded px-3 py-1.5 tracking-wide'>
          OWNER
        </span>
      </div>
      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className='px-3 sm:px-5 lg:px-6 py-6'
      >
        {/* Section 01 — PRICING */}
        <div className='flex items-center gap-3 mb-6'>
          <span className='font-mono text-xs text-cyan-500'>[01]</span>
          <span className='font-mono text-xs text-white tracking-widest font-semibold'>
            PRICING
          </span>
          <div className='flex-1 h-px bg-cyan-500/15' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-8'>
          <div>
            <FieldLabel>PC Rate (₹/hr)</FieldLabel>
            <TextInput register={register} name='pc_rate' prefix='₹' step='1' />
          </div>
          <div>
            <FieldLabel>PSVR Rate (₹/hr)</FieldLabel>
            <TextInput
              register={register}
              name='psvr_rate'
              prefix='₹'
              step='1'
            />
          </div>
          <div>
            <FieldLabel>PS5 · 1 Player (₹/hr)</FieldLabel>
            <TextInput
              register={register}
              name='ps5_rate_1p'
              prefix='₹'
              step='1'
            />
          </div>
          <div>
            <FieldLabel>PS5 · 2 Players (₹/hr)</FieldLabel>
            <TextInput
              register={register}
              name='ps5_rate_2p'
              prefix='₹'
              step='1'
            />
          </div>
          <div>
            <FieldLabel>PS5 · 3 Players (₹/hr)</FieldLabel>
            <TextInput
              register={register}
              name='ps5_rate_3p'
              prefix='₹'
              step='1'
            />
          </div>
          <div>
            <FieldLabel>PS5 · 4 Players (₹/hr)</FieldLabel>
            <TextInput
              register={register}
              name='ps5_rate_4p'
              prefix='₹'
              step='1'
            />
          </div>
          <div>
            <FieldLabel>Racing Sim · Single (₹/hr)</FieldLabel>
            <TextInput
              register={register}
              name='racing_single_rate'
              prefix='₹'
              step='1'
            />
          </div>
          <div>
            <FieldLabel>Racing Sim · Multiplayer (₹/hr)</FieldLabel>
            <TextInput
              register={register}
              name='racing_multiplayer_rate'
              prefix='₹'
              step='1'
            />
          </div>
        </div>

        {/* Section 02 — CAFE HOURS */}
        <div className='flex items-center gap-3 mb-6'>
          <span className='font-mono text-xs text-cyan-500'>[02]</span>
          <span className='font-mono text-xs text-white tracking-widest font-semibold'>
            CAFE_HOURS
          </span>
          <div className='flex-1 h-px bg-cyan-500/15' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 mb-5 @2xl:mb-8'>
          <Controller
            name='opening_time'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='startTime' className={microLabel}>
                  Start time
                </FieldLabel>
                <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      id='startTime'
                      // disabled={lockStructuralFields}
                      variant='outline'
                      onBlur={field.onBlur}
                      className={cn(
                        fieldCls,
                        'w-full justify-start font-mono text-xs uppercase',
                      )}
                    >
                      {field.value || 'Select start time'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='p-0'>
                    <WheelTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />
          <Controller
            name='closing_time'
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel htmlFor='closing_time' className={microLabel}>
                  Closing time
                </FieldLabel>
                <Popover open={closeTimeOpen} onOpenChange={setCloseTimeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type='button'
                      id='startTime'
                      // disabled={lockStructuralFields}
                      variant='outline'
                      onBlur={field.onBlur}
                      className={cn(
                        fieldCls,
                        'w-full justify-start font-mono text-xs uppercase',
                      )}
                    >
                      {field.value || 'Select Closing time'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align='start' className='p-0'>
                    <WheelTimePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
            )}
          />
          {/* <div>
            <FieldLabel>Opening Time</FieldLabel>
            <input
              {...register('opening_time')}
              type='time'
              className='w-full bg-black/60 border border-cyan-500/20 rounded-md px-3 py-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors'
            />
          </div> */}
          {/* <div>
            <FieldLabel>Closing Time</FieldLabel>
            <input
              {...register('closing_time')}
              type='time'
              className='w-full bg-black/60 border border-cyan-500/20 rounded-md px-3 py-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors'
            />
          </div> */}
        </div>

        {/* Footer — TIMELINE-style CTA bar */}
        <div className='flex flex-col overflow-hidden rounded-lg border border-cyan-500/30 @2xl:flex-row @2xl:items-center @2xl:justify-between'>
          <div className='px-4 py-3 @2xl:px-5 @2xl:py-4'>
            <p className='font-mono text-[10px] uppercase tracking-wide text-white/40'>
              Unsaved changes are not applied
            </p>
          </div>

          {/* Actions */}
          <div className='flex w-full border-t border-cyan-500/20 @2xl:w-auto @2xl:border-t-0'>
            <button
              type='button'
              onClick={() => reset(data)}
              className='flex-1 px-4 py-3 font-mono text-xs tracking-wider text-white/50 transition-colors hover:text-white @2xl:flex-none @2xl:px-5 @2xl:py-4'
            >
              RESET
            </button>

            <button
              type='submit'
              disabled={mutation.isPending}
              className='flex-1 border-l border-cyan-500/30 bg-cyan-500/10 px-4 py-3 font-mono text-xs tracking-wider text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50 @2xl:flex-none @2xl:px-6 @2xl:py-4 @2xl:text-sm'
              style={{
                clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)',
              }}
            >
              {mutation.isPending ? 'SAVING...' : 'SAVE_CHANGES'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
