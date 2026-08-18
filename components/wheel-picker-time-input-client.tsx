// components/WheelTimePickerClient.tsx
'use client';

import dynamic from 'next/dynamic';
import { forwardRef } from 'react';
import type { WheelTimePickerProps } from '@/components/wheel-picker-time-input';

// ✅ Lazy load WheelTimePicker only when needed
const WheelTimePicker = dynamic(
  () =>
    import('@/components/wheel-picker-time-input').then((mod) => ({
      default: mod.WheelTimePicker,
    })),
  {
    ssr: false,
    loading: () => <div className='h-64 bg-muted rounded animate-pulse' />,
  },
);

export const WheelTimePickerClient = forwardRef<
  HTMLDivElement,
  WheelTimePickerProps
>(function WheelTimePickerClient(props, ref) {
  return <WheelTimePicker ref={ref} {...props} />;
});
