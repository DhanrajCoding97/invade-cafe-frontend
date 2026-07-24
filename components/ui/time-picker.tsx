'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  id?: string;
  placeholder?: string;
  /**
   * Use 24-hour clock by default. Set to false for 12-hour clock with AM/PM.
   * @default true
   */
  use24Hour?: boolean;
}

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function parseTime(value: string, use24Hour: boolean) {
  const [h = '00', m = '00'] = value?.split(':') ?? [];
  let hour = Math.min(23, Math.max(0, Number.parseInt(h, 10) || 0));
  const minute = Math.min(59, Math.max(0, Number.parseInt(m, 10) || 0));
  let period: 'AM' | 'PM' = 'AM';

  if (!use24Hour) {
    period = hour >= 12 ? 'PM' : 'AM';
    if (hour === 0) hour = 12;
    else if (hour > 12) hour -= 12;
  }

  return { hour: pad(hour), minute: pad(minute), period };
}

function formatTime(
  hour: string,
  minute: string,
  period: 'AM' | 'PM',
  use24Hour: boolean,
) {
  let h = Number.parseInt(hour, 10);
  if (!use24Hour) {
    if (period === 'AM' && h === 12) h = 0;
    else if (period === 'PM' && h !== 12) h += 12;
  }
  return `${pad(h)}:${pad(Number.parseInt(minute, 10))}`;
}

export function TimePicker({
  value = '',
  onChange,
  className,
  disabled,
  id,
  placeholder = 'Pick a time',
  use24Hour = true,
}: TimePickerProps) {
  const { hour, minute, period } = parseTime(value, use24Hour);
  const [open, setOpen] = React.useState(false);

  const hours = use24Hour
    ? Array.from({ length: 24 }, (_, i) => pad(i))
    : Array.from({ length: 12 }, (_, i) => pad(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => pad(i));

  const handleChange = (field: 'hour' | 'minute' | 'period', next: string) => {
    const nextHour = field === 'hour' ? next : hour;
    const nextMinute = field === 'minute' ? next : minute;
    const nextPeriod = (field === 'period' ? next : period) as 'AM' | 'PM';
    onChange?.(formatTime(nextHour, nextMinute, nextPeriod, use24Hour));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant='outline'
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <Clock className='mr-2 h-4 w-4' />
          {value
            ? `${hour}:${minute}${use24Hour ? '' : ` ${period}`}`
            : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-3' align='start'>
        <div className='flex items-end gap-2'>
          <div className='grid gap-1'>
            <Label className='text-xs text-muted-foreground'>Hour</Label>
            <Select value={hour} onValueChange={(v) => handleChange('hour', v)}>
              <SelectTrigger className='w-[70px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className='pb-2 text-muted-foreground'>:</span>

          <div className='grid gap-1'>
            <Label className='text-xs text-muted-foreground'>Minute</Label>
            <Select
              value={minute}
              onValueChange={(v) => handleChange('minute', v)}
            >
              <SelectTrigger className='w-[70px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {!use24Hour && (
            <div className='grid gap-1'>
              <Label className='text-xs text-muted-foreground'>Period</Label>
              <Select
                value={period}
                onValueChange={(v) => handleChange('period', v as 'AM' | 'PM')}
              >
                <SelectTrigger className='w-[70px]'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='AM'>AM</SelectItem>
                  <SelectItem value='PM'>PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/**
 * Drop-in replacement for a native `<input type="time" />`.
 * Forwards a ref and accepts all standard input props.
 */
export const TimePickerInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'onChange'> &
    Pick<TimePickerProps, 'use24Hour'>
>(({ className, use24Hour, ...props }, ref) => {
  return (
    <Input
      type='time'
      ref={ref}
      className={cn(
        '[color-scheme:dark] [&::-webkit-calendar-picker-indicator]:invert',
        className,
      )}
      {...props}
    />
  );
});
TimePickerInput.displayName = 'TimePickerInput';
