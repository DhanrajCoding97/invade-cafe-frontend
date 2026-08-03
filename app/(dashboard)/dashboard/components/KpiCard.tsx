// components/dashboard/kpi-card.tsx
export function KpiCard({
  label,
  value,
  subtext,
}: {
  label: string;
  value: string;
  subtext?: string;
}) {
  return (
    <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
      <p className='text-xs text-white/50 mb-1'>{label}</p>
      <p className='text-2xl font-bold text-white'>{value}</p>
      {subtext && <p className='text-xs text-white/40 mt-1'>{subtext}</p>}
    </div>
  );
}
