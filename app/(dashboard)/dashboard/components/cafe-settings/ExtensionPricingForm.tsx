// ExtensionPricingForm.tsx
'use client';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

const DURATIONS = [15, 30, 60, 120] as const;

const ROWS = [
  { device: 'pc', tier: null, label: 'PC' },
  { device: 'vr', tier: null, label: 'PSVR' },
  { device: 'racing', tier: 'single', label: 'Racing Sim · Single' },
  { device: 'racing', tier: 'multiplayer', label: 'Racing Sim · Multiplayer' },
  { device: 'ps5', tier: '1p', label: 'PS5 · 1 Player' },
  { device: 'ps5', tier: '2p', label: 'PS5 · 2 Players' },
  { device: 'ps5', tier: '3p', label: 'PS5 · 3 Players' },
  { device: 'ps5', tier: '4p', label: 'PS5 · 4 Players' },
] as const;

interface ExtensionPricingRow {
  device: string;
  tier: string | null;
  duration_minutes: number;
  price: number;
}

async function fetchExtensionPricing(): Promise<ExtensionPricingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase.from('extension_pricing').select('*');
  if (error) throw error;
  return data ?? [];
}

async function updateExtensionPricing(rows: ExtensionPricingRow[]) {
  const supabase = createClient();
  const { error } = await supabase
    .from('extension_pricing')
    .upsert(rows, { onConflict: 'device,tier,duration_minutes' });
  if (error) throw error;
}

export default function ExtensionPricingForm() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['extension-pricing'],
    queryFn: fetchExtensionPricing,
  });

  // Build a lookup keyed by `${device}:${tier}:${duration}` for O(1) access in the grid
  const priceMap = new Map(
    (data ?? []).map((r) => [
      `${r.device}:${r.tier ?? ''}:${r.duration_minutes}`,
      r,
    ]),
  );

  const { register, handleSubmit, reset } = useForm<Record<string, number>>({
    values: Object.fromEntries(
      (data ?? []).map((r) => [
        `${r.device}:${r.tier ?? ''}:${r.duration_minutes}`,
        r.price,
      ]),
    ),
  });

  const mutation = useMutation({
    mutationFn: updateExtensionPricing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['extension-pricing'] });
      toast.success('Extension pricing updated');
    },
    onError: (err) => toast.error(err.message),
  });

  const onSubmit = (values: Record<string, number>) => {
    const rows: ExtensionPricingRow[] = ROWS.flatMap(({ device, tier }) =>
      DURATIONS.map((duration_minutes) => {
        const key = `${device}:${tier ?? ''}:${duration_minutes}`;
        return {
          device,
          tier,
          duration_minutes,
          price: Number(values[key]) || 0,
        };
      }),
    );
    mutation.mutate(rows);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[40vh]'>
        <div className='h-8 w-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <div className='w-full sm:max-w-4xl bg-[#080a0d] border border-cyan-500/10 rounded-2xl overflow-hidden'>
      <div className='flex items-center justify-between px-6 py-5 border-b border-cyan-500/10'>
        <div>
          <p className='font-mono text-sm text-white tracking-wider font-semibold'>
            EXTENSION_PRICING
          </p>
          <p className='font-mono text-[10px] text-white/40 tracking-wide'>
            OWNER_ACCESS_ONLY
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='px-6 py-6'>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm'>
            <thead>
              <tr className='text-left font-mono text-[10px] text-white/40 tracking-wide uppercase'>
                <th className='pb-3 pr-4'>Device / Tier</th>
                {DURATIONS.map((d) => (
                  <th key={d} className='pb-3 px-2'>
                    {d < 60 ? `${d} min` : `${d / 60} hr`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(({ device, tier, label }) => (
                <tr
                  key={`${device}:${tier}`}
                  className='border-t border-cyan-500/10'
                >
                  <td className='py-3 pr-4 font-mono text-xs text-white'>
                    {label}
                  </td>
                  {DURATIONS.map((duration) => {
                    const key = `${device}:${tier ?? ''}:${duration}`;
                    return (
                      <td key={duration} className='py-3 px-2'>
                        <div className='relative'>
                          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono text-xs'>
                            ₹
                          </span>
                          <input
                            {...register(key, { valueAsNumber: true })}
                            type='number'
                            step='1'
                            className='w-24 bg-black/60 border border-cyan-500/20 rounded-md pl-6 pr-2 py-2 font-mono text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors'
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className='flex flex-col overflow-hidden rounded-lg border border-cyan-500/30 sm:flex-row sm:items-center sm:justify-between mt-6'>
          <div className='px-4 py-3 sm:px-5 sm:py-4'>
            <p className='font-mono text-[10px] uppercase tracking-wide text-white/40'>
              Unsaved changes are not applied
            </p>
          </div>
          <div className='flex w-full border-t border-cyan-500/20 sm:w-auto sm:border-t-0'>
            <button
              type='button'
              onClick={() => reset()}
              className='flex-1 px-4 py-3 font-mono text-xs tracking-wider text-white/50 transition-colors hover:text-white sm:flex-none sm:px-5 sm:py-4'
            >
              RESET
            </button>
            <button
              type='submit'
              disabled={mutation.isPending}
              className='flex-1 border-l border-cyan-500/30 bg-cyan-500/10 px-4 py-3 font-mono text-xs tracking-wider text-cyan-400 transition-colors hover:bg-cyan-500/20 disabled:opacity-50 sm:flex-none sm:px-6 sm:py-4 sm:text-sm'
              style={{ clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              {mutation.isPending ? 'SAVING...' : 'SAVE_CHANGES'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
