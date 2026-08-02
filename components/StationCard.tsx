// components/stations/StationCard.tsx
import { Pencil, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
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
};

export default function StationCard({
  station,
  onEdit,
  onDelete,
  onStatusChange,
}: {
  station: StationRow;
  onEdit: (station: StationRow) => void;
  onDelete: (id: string) => void;
  onStatusChange: (station: StationRow, status: OperationalStatus) => void;
}) {
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

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className='rounded p-1 text-white/60 hover:text-red-400'>
                <Trash2 className='h-3.5 w-3.5' />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete station?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>{station.name}</strong>.
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(station.id)}
                  variant='destructive'
                >
                  Delete Station
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {station.type === 'pc' && station.specs && (
        <p className='mt-1 truncate text-[11px] text-white/40'>
          {station.specs.cpu} · {station.specs.gpu} · {station.specs.ram}
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
        </SelectContent>
      </Select>
    </div>
  );
}
