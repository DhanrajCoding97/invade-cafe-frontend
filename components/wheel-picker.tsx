import '@ncdai/react-wheel-picker/style.css';

import type { ComponentProps } from 'react';
import * as WheelPickerPrimitive from '@ncdai/react-wheel-picker';

import { cn } from '@/lib/utils';

type WheelPickerValue = WheelPickerPrimitive.WheelPickerValue;

type WheelPickerOption<T extends WheelPickerValue = string> =
  WheelPickerPrimitive.WheelPickerOption<T>;

type WheelPickerClassNames = WheelPickerPrimitive.WheelPickerClassNames;

function WheelPickerWrapper({
  className,
  ...props
}: ComponentProps<typeof WheelPickerPrimitive.WheelPickerWrapper>) {
  return (
    <WheelPickerPrimitive.WheelPickerWrapper
      className={cn(
        'w-70 rounded-lg border border-cyan-400/40 bg-[#121C1D] px-1 shadow-xs',
        '*:data-rwp:first:*:data-rwp-highlight-wrapper:rounded-s-md',
        '*:data-rwp:last:*:data-rwp-highlight-wrapper:rounded-e-md',
        className,
      )}
      {...props}
    />
  );
}

function WheelPicker<T extends WheelPickerValue = string>({
  classNames,
  ...props
}: WheelPickerPrimitive.WheelPickerProps<T>) {
  return (
    <WheelPickerPrimitive.WheelPicker
      classNames={{
        optionItem: cn(
          'text-cyan-100/30 data-disabled:opacity-40',
          classNames?.optionItem,
        ),
        highlightWrapper: cn(
          'bg-cyan-400/15 text-cyan-50',
          'data-rwp-focused:inset-ring-2 data-rwp-focused:inset-ring-cyan-400/60',
          classNames?.highlightWrapper,
        ),
        highlightItem: cn(
          'data-disabled:opacity-40',
          classNames?.highlightItem,
        ),
      }}
      {...props}
    />
  );
}

export { WheelPicker, WheelPickerWrapper };
export type { WheelPickerClassNames, WheelPickerOption };
