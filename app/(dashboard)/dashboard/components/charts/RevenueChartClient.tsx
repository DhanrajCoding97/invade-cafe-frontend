// app/(dashboard)/components/charts/RevenueChartClient.tsx
'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// ✅ Lazy load the actual chart - ECharts only loads here
const RevenueChart = dynamic(
  () => import('./RevenueChart').then((mod) => ({ default: mod.RevenueChart })),
  {
    ssr: false,
    loading: () => (
      <div className='h-96 bg-white/5 rounded-lg border border-white/10 animate-pulse' />
    ),
  },
);

interface RevenueChartClientProps {
  data: any[]; // Replace with your type
}

export function RevenueChartClient({ data }: RevenueChartClientProps) {
  return (
    <Suspense
      fallback={
        <div className='h-96 bg-white/5 rounded-lg border border-white/10 animate-pulse' />
      }
    >
      <RevenueChart data={data} />
    </Suspense>
  );
}
