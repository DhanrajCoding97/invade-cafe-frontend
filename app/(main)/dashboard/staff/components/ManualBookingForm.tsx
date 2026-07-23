'use client';

/**
 * ASSUMPTIONS — adjust to match your actual schema/enums:
 * - device enum: 'pc' | 'ps5' | 'racing_sim' | 'vr'
 * - tier enum: 'standard' | 'premium' (drop this field if you don't have tiers)
 * - stations table has: id, name, type, status, hourly_rate
 * - bookings table can accept: customer_name, customer_phone, station_id, device,
 *   tier, players, duration, uses_vr, date, start_time, payment_method,
 *   payment_status, total_amount, created_by, notes, session_started_at
 * - You have an RLS policy allowing staff/owner to INSERT into bookings directly
 *   (this form writes straight to the table, bypassing Razorpay — make sure
 *   that policy exists, e.g. `get_my_role() in ('staff','owner')`)
 * - getDisplayRate/calculateTotal are the same pricing helpers from your
 *   booking wizard — reused here so pricing logic stays in one place
 */

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import { toast } from 'sonner'; // swap for your actual toast lib if different
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import {
  manualBookingSchema,
  type ManualBookingValues,
} from '@/lib/schemas/ManualBookingFormSchema';

type ManualBookingInput = z.input<typeof manualBookingSchema>;
type ManualBookingOutput = z.output<typeof manualBookingSchema>;
// const manualBookingSchema = z.object({
//   customerName: z.string().min(1, 'Name is required'),
//   customerPhone: z
//     .string()
//     .min(10, 'Enter a valid phone number')
//     .max(15, 'Enter a valid phone number'),
//   stationId: z.string().min(1, 'Select a station'),
//   device: z.enum(['pc', 'ps5', 'vr', 'racing'], 'Please select a device'),
//   tier: z.enum(['single', 'multiplayer']).optional(),
//   players: z.coerce.number().int().min(1).max(4),
//   duration: z.number().min(1),
//   startNow: z.boolean(),
//   date: z.string().min(1, 'Date is required'),
//   startTime: z.string().min(1, 'Start time is required'),
//   paymentMethod: z.enum(['cash', 'upi_manual', 'complimentary']),
//   amountOverride: z.coerce.number().min(0).optional(),
//   notes: z.string().max(300).optional(),
// });

// type ManualBookingValues = z.infer<typeof manualBookingSchema>;

interface Station {
  id: string;
  name: string;
  type: string;
  hourly_rate: number;
  status: string;
}

async function fetchAvailableStations(): Promise<Station[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('stations')
    .select('id, name, type, hourly_rate, status')
    .eq('status', 'available')
    .order('name');
  if (error) throw error;
  return data ?? [];
}

function nowDateAndTime() {
  const now = new Date();
  const startTime = now.toTimeString().slice(0, 5);
  return { date: now, startTime };
}

interface ManualBookingFormProps {
  onCreated?: (bookingId: string) => void;
}

export default function ManualBookingForm({
  onCreated,
}: ManualBookingFormProps) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { date: today, startTime: nowTime } = nowDateAndTime();

  const { data: stations = [], isLoading: stationsLoading } = useQuery({
    queryKey: ['available-stations'],
    queryFn: fetchAvailableStations,
    refetchInterval: 15_000, // walk-in flow — keep this fresh, staff is picking live
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManualBookingInput, any, ManualBookingOutput>({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      //   device: 'pc',
      stationId: '',
      duration: 1,
      players: 1,
      tier: 'single',
      startNow: true,
      date: new Date(),
      startTime: nowTime,
      paymentMethod: 'cash',
    },
  });

  const startNow = watch('startNow');
  const stationId = watch('stationId');
  const device = watch('device');
  const tier = watch('tier');
  const duration = watch('duration');
  const paymentMethod = watch('paymentMethod');
  const amountOverride = watch('amountOverride');

  // Keep date/time pinned to "now" while startNow is checked
  useEffect(() => {
    if (startNow) {
      const { date, startTime } = nowDateAndTime();
      setValue('date', date);
      setValue('startTime', startTime);
    }
  }, [startNow, setValue]);

  useEffect(() => {
    if (device === 'ps5') {
      setValue('tier', undefined);
      // players stays user-controlled, default handled below
    } else if (device === 'racing') {
      setValue('players', 1);
    } else {
      // pc or vr
      setValue('players', 1);
      setValue('tier', undefined);
    }
  }, [device, setValue]);

  const showPlayersSelect = device === 'ps5';
  const showTierSelect = device === 'racing';

  const playersValue = Number(watch('players')) || 1;
  const durationValue = Number(watch('duration')) || 0;
  const rawAmountOverride = watch('amountOverride');
  const amountOverrideValue =
    rawAmountOverride !== undefined &&
    rawAmountOverride !== null &&
    rawAmountOverride !== ''
      ? Number(rawAmountOverride)
      : undefined;

  const selectedStation = stations.find((s) => s.id === stationId);
  const rate = selectedStation
    ? getDisplayRate({
        device,
        players: playersValue,
        tier,
        fallbackRate: selectedStation.hourly_rate,
      })
    : 0;
  const computedTotal = calculateTotal(rate, durationValue);
  const displayTotal =
    paymentMethod === 'complimentary'
      ? 0
      : amountOverrideValue !== undefined
        ? amountOverrideValue
        : computedTotal;

  async function onSubmit(values: ManualBookingOutput) {
    setSubmitting(true);
    setServerError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const total =
        values.paymentMethod === 'complimentary'
          ? 0
          : (values.amountOverride ?? computedTotal);

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_name: values.customerName,
          customer_phone: values.customerPhone,
          station_id: values.stationId,
          device: values.device,
          tier: values.tier ?? null,
          players: values.players,
          duration: values.duration,
          uses_vr: values.device === 'vr',
          date: values.date,
          start_time: values.startTime,
          payment_method: values.paymentMethod,
          payment_status: 'paid_offline',
          total_amount: total,
          created_by: user?.id ?? null,
          notes: values.notes ?? null,
          session_started_at: values.startNow ? new Date().toISOString() : null,
        })
        .select('id')
        .single();

      if (error) {
        // Surface a real double-booking / RLS message rather than a raw PG error
        if (
          error.code === '23505' ||
          error.message?.toLowerCase().includes('conflict')
        ) {
          throw new Error('That station was just booked — pick another one.');
        }
        throw new Error(error.message);
      }

      toast.success(`Booking created for ${values.customerName}`);
      queryClient.invalidateQueries({ queryKey: ['available-stations'] });
      queryClient.invalidateQueries({ queryKey: ['live-session-board'] });
      onCreated?.(data.id);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : 'Something went wrong',
      );
    } finally {
      setSubmitting(false);
    }
  }
  const stationsForDevice = stations.filter(
    (station) => station.type === device,
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4 rounded-xl border border-white/10 bg-white/3 p-5 w-full max-w-lg'
    >
      <h3 className='text-lg font-bold text-white'>Manual Walk-in Booking</h3>

      {/* Customer details */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div>
          <label className='text-xs text-[#bcbcbc]'>Customer name</label>
          <input
            {...register('customerName')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
            placeholder='e.g. Aarav'
          />
          {errors.customerName && (
            <p className='text-xs text-red-400 mt-1'>
              {errors.customerName.message}
            </p>
          )}
        </div>
        <div>
          <label className='text-xs text-[#bcbcbc]'>Phone number</label>
          <input
            {...register('customerPhone')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
            placeholder='e.g. 9876543210'
            inputMode='tel'
          />
          {errors.customerPhone && (
            <p className='text-xs text-red-400 mt-1'>
              {errors.customerPhone.message}
            </p>
          )}
        </div>
      </div>

      {/* Device / tier / players / duration */}
      <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
        <div>
          <label className='text-xs text-[#bcbcbc]'>Device</label>
          <select
            {...register('device')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
          >
            <option value='pc'>PC</option>
            <option value='ps5'>PS5</option>
            <option value='racing'>Racing Sim</option>
            <option value='vr'>VR</option>
          </select>
        </div>
        {/* if device is ps5 */}
        {showPlayersSelect && (
          <Controller
            name='players'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-xs text-[#bcbcbc]'>
                  Number of players
                </FieldLabel>
                <Select
                  value={String(field.value ?? 1)}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select players' />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? 'player' : 'players'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
        {/* if device is racing Sim */}
        {showTierSelect && (
          <Controller
            name='tier'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-xs text-[#bcbcbc]'>Mode</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select mode' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='single'>Singleplayer</SelectItem>
                    <SelectItem value='multiplayer'>Multiplayer</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        )}
        {/* <div>
          <label className='text-xs text-[#bcbcbc]'>Tier</label>
          <select
            {...register('tier')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
          >
            <option value='single'>Singleplayer</option>
            <option value='multiplayer'>Multiplayer</option>
          </select>
        </div>
        <div>
          <label className='text-xs text-[#bcbcbc]'>Players</label>
          <input
            type='number'
            min={1}
            max={4}
            {...register('players')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
          />
        </div> */}
        <div>
          <label className='text-xs text-[#bcbcbc]'>Duration (hrs)</label>
          <input
            type='number'
            step={0.5}
            min={0.5}
            max={12}
            {...register('duration')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
          />
        </div>
      </div>

      {/* Station */}
      <Controller
        name='stationId'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel className='text-xs text-[#bcbcbc]'>Station</FieldLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder='select a free station' />
              </SelectTrigger>
              <SelectContent>
                {stationsForDevice.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.type})
                  </option>
                ))}
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      {/* <div>
        <label className='text-xs text-[#bcbcbc]'>Station</label>
        <select
          {...register('stationId')}
          className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
        >
          <option value=''>
            {stationsLoading ? 'Loading…' : 'Select a free station'}
          </option>
          {stationsForDevice.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.type})
            </option>
          ))}
        </select>
        {errors.stationId && (
          <p className='text-xs text-red-400 mt-1'>
            {errors.stationId.message}
          </p>
        )}
      </div> */}

      {/* Timing */}
      <div className='flex flex-col gap-2'>
        <label className='flex items-center gap-2 text-sm text-[#bcbcbc]'>
          <Controller
            name='startNow'
            control={control}
            render={({ field }) => (
              <input
                type='checkbox'
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className='accent-[#28F1FF]'
              />
            )}
          />
          Start session now
        </label>

        {!startNow && (
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='text-xs text-[#bcbcbc]'>Date</label>
              <input
                type='date'
                {...register('date')}
                className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
              />
            </div>
            <div>
              <label className='text-xs text-[#bcbcbc]'>Start time</label>
              <input
                type='time'
                {...register('startTime')}
                className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
              />
            </div>
          </div>
        )}
      </div>

      {/* Payment */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
        <div>
          <label className='text-xs text-[#bcbcbc]'>Payment method</label>
          <select
            {...register('paymentMethod')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
          >
            <option value='cash'>Cash</option>
            <option value='upi_manual'>UPI (manual)</option>
            <option value='complimentary'>Complimentary</option>
          </select>
        </div>
        <div>
          <label className='text-xs text-[#bcbcbc]'>
            Amount{' '}
            {paymentMethod === 'complimentary'
              ? '(waived)'
              : '(₹, override if needed)'}
          </label>
          <input
            type='number'
            min={0}
            disabled={paymentMethod === 'complimentary'}
            placeholder={String(computedTotal)}
            {...register('amountOverride')}
            className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white disabled:opacity-40'
          />
        </div>
      </div>

      <div className='rounded-lg bg-white/3 px-3 py-2 flex items-center justify-between text-sm'>
        <span className='text-[#bcbcbc]'>Total to collect</span>
        <span className='text-lg font-bold text-[#28F1FF]'>
          ₹{displayTotal}
        </span>
      </div>

      {/* Notes */}
      <div>
        <label className='text-xs text-[#bcbcbc]'>Notes (optional)</label>
        <textarea
          {...register('notes')}
          rows={2}
          className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
          placeholder='e.g. parent waiting outside, birthday group, etc.'
        />
      </div>

      {serverError && <p className='text-sm text-red-400'>{serverError}</p>}

      <CornerCutButton
        type='submit'
        disabled={submitting}
        color='cyan'
        variant='outline'
        hoverEffect='scan'
        fullWidthOnMobile={true}
        className='ml-auto'
      >
        {submitting ? 'Creating…' : 'Create Booking'}
      </CornerCutButton>
    </form>
  );
}
