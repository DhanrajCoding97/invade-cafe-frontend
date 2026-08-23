// booking-date-filter.tsx
'use client';

import * as React from 'react';
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
// import { Calendar } from '@/components/ui/calendar';
const Calendar = dynamic(
  () =>
    import('@/components/ui/calendar').then((mod) => ({
      default: mod.Calendar,
    })),
  {
    ssr: false,
    loading: () => <div className='h-64 bg-muted rounded animate-pulse' />,
  },
);
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';

export function BookingDateFilter({
  date,
  onChange,
}: {
  date: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
}) {
  return (
    <div className='flex flex-1 md:flex-none items-center gap-2'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            className='justify-start px-2.5 font-normal flex-1 md:flex-none'
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <Calendar
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={onChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
