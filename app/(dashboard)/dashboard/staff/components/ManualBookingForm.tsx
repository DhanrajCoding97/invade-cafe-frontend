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
import { Checkbox } from '@/components/ui/checkbox';
import { TimePicker } from '@/components/ui/time-picker';
import { Textarea } from '@/components/ui/textarea';

type Device = z.infer<typeof manualBookingSchema>['device'];
type PAYMENT_METHOD = z.infer<typeof manualBookingSchema>['paymentMethod'];

const PAYMENT_METHODS: { value: PAYMENT_METHOD; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi_manual', label: 'upi' },
  { value: 'complimentary', label: 'complimentary' },
];

const DEVICES: { value: Device; label: string }[] = [
  { value: 'pc', label: 'PC' },
  { value: 'ps5', label: 'PS5' },
  { value: 'racing', label: 'Racing Sim' },
  { value: 'vr', label: 'VR' },
];

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
  const { startTime: nowTime } = nowDateAndTime();
  const [open, setOpen] = useState(false);

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
                    placeholder='8454994242'
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
                  <FieldLabel htmlFor='device'>Select Device</FieldLabel>

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
                    <FieldLabel htmlFor='players'>Number of players</FieldLabel>
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
                    <FieldLabel htmlFor='tier'>Mode</FieldLabel>
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
          </div>

          {/* Station */}
          <Controller
            name='stationId'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='stationId'>Station</FieldLabel>
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
            <Controller
              name='startNow'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className='flex items-center gap-3'>
                    <Checkbox
                      id='startNow'
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                      className='
                      border-[#28F1FF]/40
                      data-[state=checked]:bg-[#28F1FF]
                      data-[state=checked]:border-[#28F1FF]
                      data-[state=checked]:text-black
                      '
                    />
                    <FieldLabel
                      htmlFor='startNow'
                      className='cursor-pointer text-xs text-white/60'
                    >
                      Start session now
                    </FieldLabel>
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            {!startNow && (
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <Controller
                  name='date'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor='date' onClick={() => setOpen(true)}>
                        Select date
                      </FieldLabel>
                      <Popover open={open} onOpenChange={setOpen}>
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
                {/* start time */}
                <Controller
                  name='startTime'
                  control={control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel htmlFor='startTime'>Start Time</FieldLabel>
                      <TimePicker
                        id='startTime'
                        {...field}
                        className='w-full rounded-lg bg-black/40 border-white/10 text-white hover:bg-black/50 hover:text-white'
                      />
                    </Field>
                  )}
                />
              </div>
            )}
          </div>

          {/* Payment */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
            <Controller
              name='paymentMethod'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='device'>
                    Select Payment method
                  </FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select method' />
                    </SelectTrigger>

                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
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
            {/* amount field */}
            <Controller
              name='amountOverride'
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor='amountOverride'>Amount</FieldLabel>

                  <Input
                    id='amountOverride'
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
          </div>
          {/* Notes */}
          <Controller
            name='notes'
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='notes'>Notes</FieldLabel>
                <Textarea
                  placeholder='add notes here..'
                  id='notes'
                  cols={4}
                  className='resize-none'
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        {serverError && <p className='text-sm text-red-400'>{serverError}</p>}
        <div className='flex flex-col gap-5'>
          {/* total display */}
          <div className='mt-2 rounded-xl border border-[#28F1FF]/20 bg-[#28F1FF]/5 px-4 py-4'>
            <div className='flex items-center justify-between'>
              <span className='text-lg sm:text-xl lg:text-3xl font-bold text-[#28F1FF] uppercase tracking-wider'>
                Total
              </span>

              <span className='text-lg sm:text-xl lg:text-3xl font-bold text-[#28F1FF]'>
                ₹{displayTotal}
              </span>
            </div>
          </div>
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
        </div>
      </form>
    </div>
  );
}
