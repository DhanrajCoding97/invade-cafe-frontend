// components/BookingForm/steps/DateTimeStep.tsx
'use client';
import { Zap } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { createClient } from '@/lib/supabase/client';
import type { BookingFormValues } from '@/lib/schemas/BookingFormSchema';
import Link from 'next/link';
const OPEN_HOUR = 10; // 10:00 AM
const CLOSE_HOUR = 23; // 11:00 PM
const DURATION_OPTIONS = [1, 2, 3, 4, 5]; // hours

interface ExistingBooking {
  start_time: string;
  duration_hours: number;
}

async function fetchBookingsForDate(
  stationId: string,
  date: string,
): Promise<ExistingBooking[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('bookings')
    .select('start_time, duration_hours')
    .eq('station_id', stationId)
    .eq('date', date)
    .in('status', ['pending', 'confirmed']);
  if (error) throw error;
  return data ?? [];
}

// play now button only available for current date
function isToday(date: Date | undefined): boolean {
  if (!date) return false;
  const now = new Date();
  return date.toDateString() === now.toDateString();
}

function getCurrentTimeString(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

// / Conflict check now needs minute precision, not just hour precision,
// since "Play Now" can start at e.g. 17:40
function hasConflictMinutes(
  startTime: string,
  durationHours: number,
  bookings: ExistingBooking[],
): boolean {
  const [sh, sm] = startTime.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = startMinutes + durationHours * 60;

  return bookings.some((b) => {
    const [bh, bm] = b.start_time.split(':').map(Number);
    const bStartMinutes = bh * 60 + bm;
    const bEndMinutes = bStartMinutes + b.duration_hours * 60;
    return startMinutes < bEndMinutes && endMinutes > bStartMinutes;
  });
}

export default function DateTimeStep() {
  const { control, watch, setValue } = useFormContext<BookingFormValues>();
  const stationId = watch('stationId');
  const date = watch('date');
  const duration = watch('duration') ?? 1;
  const dateKey = date ? format(date, 'yyyy-MM-dd') : undefined;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', stationId, dateKey],
    queryFn: () => fetchBookingsForDate(stationId, dateKey!),
    enabled: !!stationId && !!dateKey,
    staleTime: 10_000,
  });

  const today = isToday(date);
  const currentHour = new Date().getHours();

  const availableSlots = Array.from(
    { length: CLOSE_HOUR - OPEN_HOUR },
    (_, i) => OPEN_HOUR + i,
  ).filter((hour) => {
    const fitsBeforeClose = hour + duration <= CLOSE_HOUR;
    const notInPast = !today || hour > currentHour; // today: only future whole-hours
    return fitsBeforeClose && notInPast;
  });

  const nowString = getCurrentTimeString();
  const nowHour = new Date().getHours();
  const playNowFits = nowHour + duration <= CLOSE_HOUR;
  const playNowConflict = hasConflictMinutes(nowString, duration, bookings);
  const canPlayNow = today && playNowFits && !playNowConflict;

  return (
    <div className='space-y-6'>
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
                  {field.value ? format(field.value, 'PPP') : 'Pick a date'}
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
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name='duration'
        control={control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Duration</FieldLabel>
            <div className='flex flex-wrap gap-2'>
              {DURATION_OPTIONS.map((hrs) => (
                <button
                  key={hrs}
                  type='button'
                  onClick={() => {
                    field.onChange(hrs);
                    setValue('startTime', ''); // reset time — old selection may no longer fit
                  }}
                  className={[
                    'flex-1 min-w-22.5 flex-wrap cursor-pointer rounded-lg border px-4 py-2 text-sm hover:bg-cyan-400/10 transition-colors duration-300 ease-in border-cyan-400 text-[#dddddd]',
                    field.value === hrs ? ' bg-cyan-400/10 text-white' : ' ',
                  ].join(' ')}
                >
                  {hrs} {hrs === 1 ? 'Hr' : 'Hrs'}
                </button>
              ))}
            </div>
          </Field>
        )}
      />

      {/* <Controller
        name='startTime'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Start time</FieldLabel>

            {!date && (
              <p className='text-sm text-white/50'>Pick a date first</p>
            )}
            {date && isLoading && (
              <p className='text-sm text-white/50'>Checking availability…</p>
            )}

            {date && !isLoading && (
              <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                {availableSlots.map((hour) => {
                  const slot = `${hour.toString().padStart(2, '0')}:00`;
                  const taken = hasConflict(hour, duration, bookings);
                  const selected = field.value === slot;
                  return (
                    <button
                      key={slot}
                      type='button'
                      disabled={taken}
                      onClick={() => field.onChange(slot)}
                      className={[
                        'rounded-lg border px-3 py-2 text-sm transition-colors',
                        selected
                          ? 'border-cyan-400 bg-cyan-400/10 text-white'
                          : 'border-white/10 text-white/70',
                        taken
                          ? 'cursor-not-allowed opacity-30 line-through'
                          : 'hover:border-white/30',
                      ].join(' ')}
                    >
                      {slot}
                    </button>
                  );
                })}
                {availableSlots.length === 0 && (
                  <p className='col-span-4 text-sm text-white/50'>
                    No slots left today for a {duration}-hour session.
                  </p>
                )}
              </div>
            )}

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      /> */}
      <Controller
        name='startTime'
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Start time</FieldLabel>

            {!date && (
              <p className='text-sm text-white/50'>Pick a date first</p>
            )}
            {date && isLoading && (
              <p className='text-sm text-white/50'>Checking availability…</p>
            )}

            {date && !isLoading && (
              <>
                {today && (
                  <button
                    type='button'
                    disabled={!canPlayNow}
                    onClick={() => field.onChange(nowString)}
                    className={[
                      'mb-3 flex cursor-pointer w-full items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold transition-colors',
                      field.value === nowString
                        ? 'border-cyan-400 bg-cyan-400/10 text-white'
                        : 'border-cyan-400/40 text-cyan-300',
                      !canPlayNow
                        ? 'cursor-not-allowed opacity-30'
                        : 'hover:border-cyan-400',
                    ].join(' ')}
                  >
                    <Zap className='h-4 w-4' />
                    {canPlayNow
                      ? `Play now — starts ${nowString}`
                      : 'Play now unavailable'}
                  </button>
                )}

                <div className='grid start-time-grid grid-cols-4 gap-2'>
                  {availableSlots.map((hour) => {
                    const slot = `${hour.toString().padStart(2, '0')}:00`;
                    const taken = hasConflictMinutes(slot, duration, bookings);
                    const selected = field.value === slot;
                    return (
                      <button
                        key={slot}
                        type='button'
                        disabled={taken}
                        onClick={() => field.onChange(slot)}
                        className={[
                          'rounded-lg border border-cyan-400 px-3 py-2 text-sm transition-colors cursor-pointer',
                          selected ? 'bg-cyan-400/10 text-white' : '',
                          taken
                            ? 'cursor-not-allowed opacity-30 line-through'
                            : 'hover:border-white/30',
                        ].join(' ')}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>

                {availableSlots.length === 0 && !canPlayNow && (
                  <div className='flex flex-col '>
                    <p className='mt-2 text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]'>
                      No slots left today for a {duration}-hour session.
                    </p>
                    <Link
                      className='hover underline underline-offset-2 text-[clamp(0.75rem,2vw,1.125rem)] text-[#bcbcbc]  decoration-primary hover:decoration-pink-600 transition-all duration-300 ease-in'
                      href='tel:+918291158779'
                    >
                      Call for confirmation
                    </Link>
                  </div>
                )}
              </>
            )}

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
