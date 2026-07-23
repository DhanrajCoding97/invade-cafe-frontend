'use client';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { getDisplayRate, calculateTotal } from '@/lib/pricing';
import { useAvailableStations } from '@/hooks/UseAvailableStation';
import { stationKeys } from '@/lib/queries/stations';
import { toast } from 'sonner'; // swap for your actual toast lib if different
import CornerCutButton from '@/app/components/neonblade-ui/corner-cut-button';
import {
  manualBookingSchema,
  type ManualBookingValues,
} from '@/lib/schemas/ManualBookingFormSchema';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/ui/phone-input';
// type ManualBookingInput = z.input<typeof manualBookingSchema>;
// type ManualBookingOutput = z.output<typeof manualBookingSchema>;
// type ManualBookingValues = z.infer<typeof manualBookingSchema>;
type Device = z.infer<typeof manualBookingSchema>['device'];

const DEVICES: { value: Device; label: string }[] = [
  { value: 'pc', label: 'PC' },
  { value: 'ps5', label: 'PS5' },
  { value: 'racing', label: 'Racing Sim' },
  { value: 'vr', label: 'VR' },
];
// interface Station {
//   id: string;
//   name: string;
//   type: string;
//   hourly_rate: number;
//   status: string;
// }

// async function fetchAvailableStations(): Promise<Station[]> {
//   const supabase = createClient();
//   const { data, error } = await supabase
//     .from('stations')
//     .select('id, name, type, hourly_rate, status')
//     .eq('status', 'available')
//     .order('name');
//   if (error) throw error;
//   return data ?? [];
// }

function nowDateAndTime() {
  const now = new Date();
  const startTime = now.toTimeString().slice(0, 5);
  return { date: now, startTime };
}

interface ManualBookingFormProps {
  onCreated?: (bookingId: string) => void;
}

// export default function ManualBookingForm({
//   onCreated,
// }: ManualBookingFormProps) {
//   const queryClient = useQueryClient();
//   const [submitting, setSubmitting] = useState(false);
//   const [serverError, setServerError] = useState<string | null>(null);
//   const { date: today, startTime: nowTime } = nowDateAndTime();

//   //   const { data: stations = [], isLoading: stationsLoading } = useQuery({
//   //     queryKey: ['available-stations'],
//   //     queryFn: fetchAvailableStations,
//   //     refetchInterval: 15_000, // walk-in flow — keep this fresh, staff is picking live
//   //   });

//   const {
//     register,
//     control,
//     handleSubmit,
//     watch,
//     setValue,
//     formState: { errors },
//   } = useForm<ManualBookingInput, any, ManualBookingOutput>({
//     resolver: zodResolver(manualBookingSchema),
//     defaultValues: {
//       customerName: '',
//       customerPhone: '',
//       device: 'pc',
//       //   stationId: '',
//       duration: 1,
//       players: 1,
//       tier: 'single',
//       startNow: true,
//       date: new Date(),
//       startTime: nowTime,
//       paymentMethod: 'cash',
//     },
//   });

//   const startNow = watch('startNow');
//   const stationId = watch('stationId');
//   const device = watch('device');
//   const tier = watch('tier');
//   const duration = watch('duration');
//   const paymentMethod = watch('paymentMethod');
//   const amountOverride = watch('amountOverride');
//   const watchedDate = watch('date');
//   const watchedStartTime = watch('startTime');

//   // Keep date/time pinned to "now" while startNow is checked
//   useEffect(() => {
//     if (startNow) {
//       const { date, startTime } = nowDateAndTime();
//       setValue('date', date);
//       setValue('startTime', startTime);
//     }
//   }, [startNow, setValue]);

//   useEffect(() => {
//     if (device === 'ps5') {
//       setValue('tier', undefined);
//       // players stays user-controlled, default handled below
//     } else if (device === 'racing') {
//       setValue('players', 1);
//     } else {
//       // pc or vr
//       setValue('players', 1);
//       setValue('tier', undefined);
//     }
//   }, [device, setValue]);

//   const showPlayersSelect = device === 'ps5';
//   const showTierSelect = device === 'racing';

//   const playersValue = Number(watch('players')) || 1;
//   const durationValue = Number(watch('duration')) || 0;
//   const rawAmountOverride = watch('amountOverride');
//   const amountOverrideValue =
//     rawAmountOverride !== undefined &&
//     rawAmountOverride !== null &&
//     rawAmountOverride !== ''
//       ? Number(rawAmountOverride)
//       : undefined;

//   const dateStr = watchedDate ? format(watchedDate, 'yyyy-MM-dd') : '';

//   const { data: stations = [], isLoading: stationsLoading } =
//     useAvailableStations({
//       date: dateStr,
//       startTime: watchedStartTime,
//       duration: durationValue,
//     });

//   // Reset station selection when the availability set changes underneath it —
//   // e.g. staff picks PC-01 for a 1hr slot, then bumps duration to 3hrs and
//   // PC-01 no longer qualifies; don't silently submit a stale selection.
//   useEffect(() => {
//     if (stationId && !stations.some((s) => s.id === stationId)) {
//       setValue('stationId', undefined);
//     }
//   }, [stations, stationId, setValue]);

//   const stationsForDevice = stations.filter(
//     (station) => station.type === device,
//   );

//   const selectedStation = stations.find((s) => s.id === stationId);
//   const rate = selectedStation
//     ? getDisplayRate({
//         device,
//         players: playersValue,
//         tier,
//         fallbackRate: selectedStation.hourly_rate,
//       })
//     : 0;
//   const computedTotal = calculateTotal(rate, durationValue);
//   const displayTotal =
//     paymentMethod === 'complimentary'
//       ? 0
//       : amountOverrideValue !== undefined
//         ? amountOverrideValue
//         : computedTotal;

//   async function onSubmit(values: ManualBookingOutput) {
//     setSubmitting(true);
//     setServerError(null);
//     console.log(values);
//     try {
//       const supabase = createClient();
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       const total =
//         values.paymentMethod === 'complimentary'
//           ? 0
//           : (values.amountOverride ?? computedTotal);

//       const { data, error } = await supabase
//         .from('bookings')
//         .insert({
//           station_id: values.stationId,
//           device: values.device,
//           tier: values.tier ?? null,
//           players: values.players,
//           duration_hours: values.duration,
//           date: values.date.toISOString().slice(0, 10),
//           start_time: values.startTime,
//           amount: total,
//           status: 'confirmed',
//           user_id: null,
//           staff_id: user?.id ?? null,
//           customer_name: values.customerName,
//           customer_phone: values.customerPhone,
//           payment_method: values.paymentMethod,
//         })
//         .select('id')
//         .single();

//       if (error) {
//         // Surface a real double-booking / RLS message rather than a raw PG error
//         if (
//           error.code === '23505' ||
//           error.message?.toLowerCase().includes('conflict')
//         ) {
//           throw new Error('That station was just booked — pick another one.');
//         }
//         throw new Error(error.message);
//       }

//       toast.success(`Booking created for ${values.customerName}`);
//       queryClient.invalidateQueries({ queryKey: ['available-stations'] });
//       queryClient.invalidateQueries({ queryKey: ['live-session-board'] });
//       onCreated?.(data.id);
//     } catch (err) {
//       setServerError(
//         err instanceof Error ? err.message : 'Something went wrong',
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   }
//   const stationsForDevice = stations.filter(
//     (station) => station.type === device,
//   );

export default function ManualBookingForm({
  onCreated,
}: ManualBookingFormProps) {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { startTime: nowTime } = nowDateAndTime();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ManualBookingValues>({
    resolver: zodResolver(manualBookingSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      device: 'pc',
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
  const paymentMethod = watch('paymentMethod');
  const watchedDate = watch('date');
  const watchedStartTime = watch('startTime');

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

  const dateStr = watchedDate ? format(watchedDate, 'yyyy-MM-dd') : '';

  const { data: stations = [], isLoading: stationsLoading } =
    useAvailableStations({
      date: dateStr,
      startTime: watchedStartTime,
      duration: durationValue,
    });

  // Reset station selection when the availability set changes underneath it —
  // e.g. staff picks PC-01 for a 1hr slot, then bumps duration to 3hrs and
  // PC-01 no longer qualifies; don't silently submit a stale selection.
  useEffect(() => {
    if (stationId && !stations.some((s) => s.id === stationId)) {
      setValue('stationId', '');
    }
  }, [stations, stationId, setValue]);

  const stationsForDevice = stations.filter(
    (station) => station.type === device,
  );

  const selectedStation = stationsForDevice.find((s) => s.id === stationId);
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
      : rawAmountOverride !== undefined
        ? rawAmountOverride
        : computedTotal;

  async function onSubmit(values: ManualBookingValues) {
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
          station_id: values.stationId,
          device: values.device,
          tier: values.tier ?? null,
          players: values.players,
          duration_hours: values.duration,
          date: format(values.date, 'yyyy-MM-dd'),
          start_time: values.startTime,
          amount: total,
          status: 'confirmed',
          user_id: null,
          staff_id: user?.id ?? null,
          customer_name: values.customerName,
          customer_phone: values.customerPhone,
          payment_method: values.paymentMethod,
          session_started_at: values.startNow ? new Date().toISOString() : null,
        })
        .select('id')
        .single();

      if (error) {
        if (
          error.code === '23505' ||
          error.message?.toLowerCase().includes('conflict')
        ) {
          throw new Error('That station was just booked — pick another one.');
        }
        throw new Error(error.message);
      }

      toast.success(`Booking created for ${values.customerName}`);
      queryClient.invalidateQueries({ queryKey: stationKeys.all });
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

  return (
    <div className='flex flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col gap-4 rounded-xl border border-white/10 bg-white/3 p-5 w-full max-w-lg'
      >
        <h3 className='text-lg font-bold text-white'>Manual Walk-in Booking</h3>
        <FieldGroup>
          {/* Customer details */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <Controller
              name='customerName'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='customerName'>Customer name</FieldLabel>
                  <Input
                    {...field}
                    id='customerName'
                    aria-invalid={fieldState.invalid}
                    placeholder='John Doe'
                    autoComplete='off'
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* phone input */}
            <Controller
              name='customerPhone'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='customerPhone'>
                    Customer Phone
                  </FieldLabel>

                  <PhoneInput
                    id='customerPhone'
                    defaultCountry='IN'
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Device / tier / players / duration */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <Controller
              name='device'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className='text-xs text-[#bcbcbc]'>
                    Select Device
                  </FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select device' />
                    </SelectTrigger>

                    <SelectContent>
                      {DEVICES.map((device) => (
                        <SelectItem key={device.value} value={device.value}>
                          {device.label}
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
                    <FieldLabel className='text-xs text-[#bcbcbc]'>
                      Mode
                    </FieldLabel>
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
            <Controller
              name='duration'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='duration'>Duration</FieldLabel>

                  <Input
                    id='duration'
                    type='number'
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(Number.isNaN(val) ? 0 : val);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* <div>
              <label className='text-xs text-[#bcbcbc]'>Duration (hrs)</label>
              <input
                type='number'
                step={0.5}
                min={0.5}
                max={12}
                {...register('duration')}
                className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
              />
            </div> */}
          </div>

          {/* Station */}
          <Controller
            name='stationId'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className='text-xs text-[#bcbcbc]'>
                  Station
                </FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a free station' />
                  </SelectTrigger>
                  <SelectContent>
                    {stationsForDevice.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} ({s.type})
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
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div>
                  {/* <label className='text-xs text-[#bcbcbc]'>Date</label>
              <input
                type='date'
                {...register('date')}
                className='mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white'
              /> */}
                  <Controller
                    name='date'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Select date</FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type='button'
                              variant='outline'
                              className='w-full justify-start text-left font-normal bg-slate-950 text-[#dddddd]'
                            >
                              <CalendarIcon className='mr-2 h-4 w-4' />
                              {field.value
                                ? format(field.value, 'PPP')
                                : 'Pick a date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-auto p-0' align='start'>
                            <Calendar
                              mode='single'
                              selected={field.value}
                              onSelect={(d) => {
                                field.onChange(d);
                                setValue('startTime', ''); // reset time when date changes
                              }}
                              disabled={(d) =>
                                d < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              autoFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
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
            {/* amount field */}
            <Controller
              name='amountOverride'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='duration'>
                    {' '}
                    Amount{' '}
                    {paymentMethod === 'complimentary'
                      ? '(waived)'
                      : '(₹, override if needed)'}
                  </FieldLabel>

                  <Input
                    id=''
                    type='number'
                    value={field.value ?? ''}
                    onChange={(e) => {
                      const val = e.target.valueAsNumber;
                      field.onChange(Number.isNaN(val) ? 0 : val);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                    disabled={paymentMethod === 'complimentary'}
                    placeholder={String(computedTotal)}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {/* <div>
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
            </div> */}
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
        </FieldGroup>
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
    </div>
  );
}
