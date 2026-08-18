import { forwardRef, useEffect, useState, useRef } from 'react';
import type { WheelPickerOption } from '@/components/wheel-picker';
import { WheelPicker, WheelPickerWrapper } from '@/components/wheel-picker';

const hourOptions = Array.from({ length: 12 }, (_, i) => ({
  label: (i + 1).toString().padStart(2, '0'),
  value: i + 1,
}));

const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
  label: i.toString().padStart(2, '0'),
  value: i,
}));

const meridiemOptions: WheelPickerOption[] = [
  { label: 'AM', value: 'AM' },
  { label: 'PM', value: 'PM' },
];

function to24Hour(hour12: number, minute: number, meridiem: 'AM' | 'PM') {
  let h = hour12 % 12;
  if (meridiem === 'PM') h += 12;
  return `${h.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function from24Hour(value: string) {
  const [hStr, mStr] = value.split(':');
  let h = parseInt(hStr, 10);
  const meridiem: 'AM' | 'PM' = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return { hour: h, minute: parseInt(mStr, 10) || 0, meridiem };
}

export interface WheelTimePickerProps {
  id?: string;
  name?: string;
  value?: string; // "HH:mm" 24hr, e.g. from an existing booking
  onChange?: (value: string) => void;
  onBlur?: () => void;
  disabled?: boolean;
  className?: string;
}

export const WheelTimePicker = forwardRef<HTMLDivElement, WheelTimePickerProps>(
  function WheelTimePicker(
    { id, value, onChange, onBlur, disabled, className },
    ref,
  ) {
    const seeded = value
      ? from24Hour(value)
      : { hour: 9, minute: 0, meridiem: 'AM' as const };
    const [hour, setHour] = useState(seeded.hour);
    const [minute, setMinute] = useState(seeded.minute);
    const [meridiem, setMeridiem] = useState<'AM' | 'PM'>(seeded.meridiem);

    // Track the last value WE emitted, so we can tell "value changed
    // externally (seed from booking)" apart from "our own onChange echoed back".
    const lastEmitted = useRef<string | undefined>(value);

    // Re-seed wheels when `value` changes from outside (e.g. editing a
    // different booking, or resetting the form) rather than from our own onChange.
    useEffect(() => {
      if (value !== undefined && value !== lastEmitted.current) {
        const next = from24Hour(value);
        setHour(next.hour);
        setMinute(next.minute);
        setMeridiem(next.meridiem);
        lastEmitted.current = value;
      }
    }, [value]);

    useEffect(() => {
      const next = to24Hour(hour, minute, meridiem);
      lastEmitted.current = next;
      onChange?.(next);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hour, minute, meridiem]);

    return (
      <div
        id={id}
        ref={ref}
        onBlur={onBlur}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className={[
          '',
          disabled ? 'pointer-events-none opacity-50' : '',
          className ?? '',
        ].join(' ')}
      >
        <WheelPickerWrapper>
          <WheelPicker
            options={hourOptions}
            value={hour}
            onValueChange={(v) => setHour(v as number)}
            infinite
          />
          <WheelPicker
            options={minuteOptions}
            value={minute}
            onValueChange={(v) => setMinute(v as number)}
            infinite
          />
          <WheelPicker
            options={meridiemOptions}
            value={meridiem}
            onValueChange={(v) => setMeridiem(v as 'AM' | 'PM')}
          />
        </WheelPickerWrapper>
      </div>
    );
  },
);
