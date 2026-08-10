'use client';

import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Settings2 } from 'lucide-react';
import { toast } from 'sonner';

interface CafeSettingsForm {
  pc_rate: number;
  psvr_rate: number;
  ps5_rate_1p: number;
  ps5_rate_2p: number;
  ps5_rate_3p: number;
  ps5_rate_4p: number;
  racing_single_rate: number;
  racing_multiplayer_rate: number;
  opening_time: string;
  closing_time: string;
}

async function fetchCafeSettings(): Promise<CafeSettingsForm> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cafe_settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data;
}

async function updateCafeSettings(values: CafeSettingsForm) {
  const supabase = createClient();
  const { error } = await supabase
    .from('cafe_settings')
    .update(values)
    .eq('id', 1);
  if (error) throw new Error(error.message);
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className='block text-cyan-400 text-xs font-mono tracking-wider uppercase mb-2'>
      {children}
    </label>
  );
}

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

export default function CafeSettingsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['cafe-settings'],
    queryFn: fetchCafeSettings,
  });

  const { register, handleSubmit, reset } = useForm<CafeSettingsForm>({
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
    return (
      <div className='flex items-center justify-center min-h-[40vh]'>
        <div className='h-8 w-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div className='max-w-3xl mx-auto bg-[#080a0d] border border-cyan-500/10 rounded-2xl overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-6 py-5 border-b border-cyan-500/10'>
        <div className='flex items-center gap-3'>
          <div className='h-8 w-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center'>
            <Settings2 size={16} className='text-cyan-400' />
          </div>
          <div>
            <p className='font-mono text-sm text-white tracking-wider font-semibold'>
              CAFE_SETTINGS
            </p>
            <p className='font-mono text-[10px] text-white/40 tracking-wide'>
              OWNER_ACCESS_ONLY
            </p>
          </div>
        </div>
        <span className='font-mono text-[10px] text-white/50 border border-white/15 rounded px-3 py-1.5 tracking-wide'>
          OWNER
        </span>
      </div>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className='px-6 py-6'
      >
        {/* Section 01 — PRICING */}
        <div className='flex items-center gap-3 mb-6'>
          <span className='font-mono text-xs text-cyan-500'>[01]</span>
          <span className='font-mono text-xs text-white tracking-widest font-semibold'>
            PRICING
          </span>
          <div className='flex-1 h-px bg-cyan-500/15' />
        </div>

        <div className='grid grid-cols-2 gap-x-6 gap-y-5 mb-8'>
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

        <div className='grid grid-cols-2 gap-x-6 gap-y-5 mb-8'>
          <div>
            <FieldLabel>Opening Time</FieldLabel>
            <input
              {...register('opening_time')}
              type='time'
              className='w-full bg-black/60 border border-cyan-500/20 rounded-md px-3 py-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors'
            />
          </div>
          <div>
            <FieldLabel>Closing Time</FieldLabel>
            <input
              {...register('closing_time')}
              type='time'
              className='w-full bg-black/60 border border-cyan-500/20 rounded-md px-3 py-3 font-mono text-sm text-white focus:outline-none focus:border-cyan-400 transition-colors'
            />
          </div>
        </div>

        {/* Footer — TIMELINE-style CTA bar */}
        <div className='flex items-center justify-between border border-cyan-500/30 rounded-lg overflow-hidden'>
          <div className='px-5 py-4'>
            <p className='font-mono text-[10px] text-white/40 tracking-wide uppercase'>
              Unsaved changes are not applied
            </p>
          </div>
          <div className='flex'>
            <button
              type='button'
              onClick={() => reset(data)}
              className='px-5 py-4 font-mono text-xs text-white/50 hover:text-white transition-colors tracking-wider'
            >
              RESET
            </button>
            <button
              type='submit'
              disabled={mutation.isPending}
              className='px-6 py-4 bg-cyan-500/10 hover:bg-cyan-500/20 border-l border-cyan-500/30 font-mono text-sm text-cyan-400 tracking-wider transition-colors disabled:opacity-50'
              style={{ clipPath: 'polygon(12px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              {mutation.isPending ? 'SAVING...' : 'SAVE_CHANGES'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
