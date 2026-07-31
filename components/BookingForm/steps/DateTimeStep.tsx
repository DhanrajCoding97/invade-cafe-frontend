// components/BookingForm/steps/DateTimeStep.tsx
'use client';
import { useState } from 'react';
import { Zap } from 'lucide-react';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Calendar } from '@/components/ui/calendar';

import { useEffect } from 'react';
import { getLenisInstance } from '@/lib/lenisInstance';
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
import { useRealtimeBookingSync } from '@/hooks/useRealtimeBookingSync';
import { WheelTimePicker } from '@/components/wheel-picker-time-input';

const OPEN_HOUR = 10; // 10:00 AM
const CLOSE_HOUR = 23; // 11:00 PM
const DURATION_OPTIONS = [1, 2, 3, 4, 5]; // hours

interface ExistingBooking {
  start_time: string;
  duration_hours: number;
  extended_until: string | null;
}

//updated fetch to get realtime data
async function fetchBookingsForDate(
  stationId: string,
  date: string,
): Promise<ExistingBooking[]> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_bookings_for_availability', {
    p_date: date,
    p_station_id: stationId,
  });
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

function hasConflictMinutes(
  startTime: string,
  durationHours: number,
  date: string, // now needed to resolve extended_until against a real timestamp
  bookings: ExistingBooking[],
): boolean {
  const [sh, sm] = startTime.split(':').map(Number);
  const startMinutes = sh * 60 + sm;
  const endMinutes = startMinutes + durationHours * 60;

  return bookings.some((b) => {
    const [bh, bm] = b.start_time.split(':').map(Number);
    const bStartMinutes = bh * 60 + bm;

    let bEndMinutes = bStartMinutes + Number(b.duration_hours) * 60;

    if (b.extended_until) {
      const bStartDate = new Date(`${date}T${b.start_time}`);
      const extendedDate = new Date(b.extended_until);
      const extendedMinutesFromStart =
        (extendedDate.getTime() - bStartDate.getTime()) / 60_000;
      bEndMinutes = bStartMinutes + extendedMinutesFromStart;
    }

    return startMinutes < bEndMinutes && endMinutes > bStartMinutes;
  });
}

export default function DateTimeStep() {
  const [showCustomTime, setShowCustomTime] = useState(false);
  const [customTime, setCustomTime] = useState('');
  useRealtimeBookingSync();
  const { control, watch, setValue } = useFormContext<BookingFormValues>();
  const stationId = watch('stationId');
  const date = watch('date');
  const duration = watch('duration') ?? 1;
  const dateKey = date ? format(date, 'yyyy-MM-dd') : undefined;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings', stationId, dateKey],
    queryFn: () => fetchBookingsForDate(stationId, dateKey!),
    enabled: !!stationId && !!dateKey,
    staleTime: 0,
    refetchInterval: 10_000,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  const today = isToday(date);
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const OPEN_MINUTES = OPEN_HOUR * 60;
  const CLOSE_MINUTES = CLOSE_HOUR * 60;
  const PLAY_NOW_BUFFER = 10; // minutes of operational slack before close

  //custom time slots
  const customTimeConflict =
    customTime && dateKey
      ? hasConflictMinutes(customTime, duration, dateKey, bookings)
      : false;

  const customTimeInPast =
    today && customTime
      ? (() => {
          const [ch, cm] = customTime.split(':').map(Number);
          return ch * 60 + cm <= nowMinutes;
        })()
      : false;

  const customTimeFitsBeforeClose = customTime
    ? (() => {
        const [ch, cm] = customTime.split(':').map(Number);
        return ch * 60 + cm + duration * 60 <= CLOSE_MINUTES;
      })()
    : true;

  const customTimeValid =
    !!customTime &&
    !customTimeConflict &&
    !customTimeInPast &&
    customTimeFitsBeforeClose;

  const availableSlots = Array.from(
    { length: CLOSE_HOUR - OPEN_HOUR },
    (_, i) => OPEN_HOUR + i,
  ).filter((hour) => {
    const slotStartMinutes = hour * 60;
    const fitsBeforeClose = slotStartMinutes + duration * 60 <= CLOSE_MINUTES;
    const notInPast = !today || slotStartMinutes > nowMinutes;
    return fitsBeforeClose && notInPast;
  });

  const nowString = getCurrentTimeString();
  const cafeIsOpenNow =
    nowMinutes >= OPEN_MINUTES && nowMinutes < CLOSE_MINUTES;

  const playNowFits =
    nowMinutes + duration * 60 <= CLOSE_MINUTES - PLAY_NOW_BUFFER;
  // const playNowConflict = hasConflictMinutes(nowString, duration, bookings);
  const playNowConflict = hasConflictMinutes(
    nowString,
    duration,
    dateKey!,
    bookings,
  );

  const canPlayNow = today && cafeIsOpenNow && playNowFits && !playNowConflict;

  useEffect(() => {
    const lenis = getLenisInstance();

    if (!lenis) return;

    if (showCustomTime) {
      lenis.stop();
    } else {
      lenis.start();
    }

    return () => lenis.start();
  }, [showCustomTime]);

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
                {today && cafeIsOpenNow && (
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

                {today && !cafeIsOpenNow && (
                  <p className='mb-3 text-sm text-white/50'>
                    Cafe opens at{' '}
                    <span className='text-primary'>{OPEN_HOUR}:00</span> — book
                    a slot for later today instead.
                  </p>
                )}

                <div className='grid start-time-grid grid-cols-4 gap-2'>
                  {availableSlots.map((hour) => {
                    const slot = `${hour.toString().padStart(2, '0')}:00`;
                    // const taken = hasConflictMinutes(slot, duration, bookings);
                    const taken = hasConflictMinutes(
                      slot,
                      duration,
                      dateKey!,
                      bookings,
                    );

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
                {/* below the availableSlots grid */}
                {/* <div className='mt-3'>
                  {!showCustomTime ? (
                    <button
                      type='button'
                      onClick={() => setShowCustomTime(true)}
                      className='text-xs text-cyan-400 underline underline-offset-2'
                    >
                      Want a different time? Pick exact time
                    </button>
                  ) : (
                    <div className='flex flex-col gap-2'>
                      <WheelTimePicker
                        value={customTime}
                        onChange={setCustomTime}
                      />

                      <button
                        type='button'
                        disabled={!customTimeValid}
                        onClick={() => field.onChange(customTime)}
                        className={[
                          'rounded-lg px-4 py-2 text-sm font-medium',
                          customTimeValid
                            ? 'bg-cyan-400 text-black'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed',
                        ].join(' ')}
                      >
                        Use this time
                      </button>

                      {customTime && customTimeConflict && (
                        <p className='text-xs text-red-400'>
                          This time overlaps an existing booking.
                        </p>
                      )}
                      {customTime && customTimeInPast && (
                        <p className='text-xs text-red-400'>
                          That time has already passed today.
                        </p>
                      )}
                      {customTime && !customTimeFitsBeforeClose && (
                        <p className='text-xs text-red-400'>
                          Session would run past closing time.
                        </p>
                      )}
                    </div>
                  )}
                </div> */}
                <div className='mt-3'>
                  <Popover
                    open={showCustomTime}
                    onOpenChange={setShowCustomTime}
                  >
                    <PopoverTrigger asChild>
                      <button
                        type='button'
                        className='text-xs text-cyan-400 underline underline-offset-2'
                      >
                        {customTime
                          ? `Custom time: ${customTime} — change?`
                          : 'Want a different time? Pick exact time'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      data-lenis-prevent
                      align='start'
                      className='w-70 border-cyan-400/40 bg-[#121C1D] p-3 touch-pan-y'
                    >
                      <div className='flex flex-col gap-2'>
                        <div className='max-h-80 overflow-y-auto overscroll-contain'>
                          <WheelTimePicker
                            value={customTime}
                            onChange={setCustomTime}
                          />
                        </div>
                        <button
                          type='button'
                          disabled={!customTimeValid}
                          onClick={() => {
                            field.onChange(customTime);
                            setShowCustomTime(false); // close popover once confirmed
                          }}
                          className={[
                            'rounded-lg px-4 py-2 text-sm font-medium',
                            customTimeValid
                              ? 'bg-cyan-400 text-black'
                              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed',
                          ].join(' ')}
                        >
                          Use this time
                        </button>

                        {customTime && customTimeConflict && (
                          <p className='text-xs text-red-400'>
                            This time overlaps an existing booking.
                          </p>
                        )}
                        {customTime && customTimeInPast && (
                          <p className='text-xs text-red-400'>
                            That time has already passed today.
                          </p>
                        )}
                        {customTime && !customTimeFitsBeforeClose && (
                          <p className='text-xs text-red-400'>
                            Session would run past closing time.
                          </p>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {availableSlots.length === 0 && !canPlayNow && (
                  <div className='flex flex-col '>
                    <p className='mt-2 text-[clamp(0.8rem,2vw,1.125rem)] text-[#bcbcbc]'>
                      No slots left today for a {duration}-hour session.
                    </p>
                    <Link
                      className='hover underline underline-offset-2 text-[clamp(0.8rem,2vw,1.125rem)] text-[#bcbcbc]  decoration-primary hover:decoration-pink-600 transition-all duration-300 ease-in'
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
