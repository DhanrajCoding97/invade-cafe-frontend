'use client';
import {
  EChartsLineChart,
  type ChartConfig,
} from '@/components/evilcharts/charts/echarts-line-chart';

const chartConfig = {
  revenue: {
    label: 'Revenue',
    colors: {
      light: ['#06b6d4'],
      dark: ['#22d3ee'],
    },
  },
} satisfies ChartConfig;
export function RevenueChart({
  data,
}: {
  data: { day: string; revenue: number }[];
}) {
  return (
    <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
      <h3 className='mb-4 text-sm font-semibold text-white/80'>
        Revenue — Last 7 Days
      </h3>

      <EChartsLineChart
        data={data}
        config={chartConfig}
        curveType='monotone'
        className='h-[220px]'
      >
        <EChartsLineChart.Grid />

        <EChartsLineChart.XAxis dataKey='day' />

        <EChartsLineChart.YAxis />

        <EChartsLineChart.Tooltip />

        <EChartsLineChart.Line dataKey='revenue' glowing strokeVariant='solid'>
          <EChartsLineChart.Dot variant='border' />
          <EChartsLineChart.ActiveDot variant='colored-border' />
        </EChartsLineChart.Line>
      </EChartsLineChart>
    </div>
  );
}
