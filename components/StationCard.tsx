import { Pencil } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import type { StationRow, OperationalStatus } from '@/types';

const STATUS_STYLES: Record<OperationalStatus, string> = {
  active: 'text-cyan-300 border-cyan-400/40',
  maintenance: 'text-amber-300 border-amber-400/40',
  offline: 'text-red-400 border-red-400/40',
  retired: 'border-slate-500/40 bg-slate-500/10 text-slate-300',
};

export default function StationCard({
  station,
  onEdit,
  onStatusChange,
}: {
  station: StationRow;
  onEdit: (station: StationRow) => void;
  onStatusChange: (
    station: StationRow,
    operational_status: OperationalStatus,
  ) => void;
}) {
  const specText = [station.specs?.cpu, station.specs?.gpu, station.specs?.ram]
    .filter(Boolean)
    .join(' · ');
  return (
    <div className='rounded-xl border border-cyan-400/20 bg-black p-4'>
      <div className='flex items-center justify-between'>
        <span className='font-bold text-cyan-300'>{station.name}</span>
        <div className='flex gap-1'>
          <button
            onClick={() => onEdit(station)}
            className='rounded p-1 text-white/60 hover:text-cyan-300'
          >
            <Pencil className='h-3.5 w-3.5' />
          </button>
        </div>
      </div>

      {station.type === 'pc' && (
        <p className='mt-1 truncate text-[11px] text-white/40'>
          {specText || 'Add hardware specs'}
        </p>
      )}

      <Select
        value={station.operational_status}
        onValueChange={(v) => onStatusChange(station, v as OperationalStatus)}
      >
        <SelectTrigger
          className={`mt-3 h-7 w-full text-xs ${STATUS_STYLES[station.operational_status]}`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='active'>Active</SelectItem>
          <SelectItem value='maintenance'>Maintenance</SelectItem>
          <SelectItem value='offline'>Offline</SelectItem>
          <SelectItem value='retired'>Retired</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
