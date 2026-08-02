// // app/dashboard/staff/stations/page.tsx
// 'use client';

// import { useState } from 'react';
// import { fetchAdminStations, stationKeys } from '@/lib/queries/stations';
// import { useQuery, useQueryClient } from '@tanstack/react-query';
// import { Plus, Pencil, Trash2 } from 'lucide-react';
// import StationForm from '../../components/stations/StationForm';
// import {
//   useDeleteStation,
//   useUpdateStationStatus,
// } from '@/hooks/use-station-mutations';

// import type { StationRow, OperationalStatus, StationType } from '@/types';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectItem,
//   SelectContent,
// } from '@/components/ui/select';
// import { toast } from 'sonner';

// // async function fetchStations(): Promise<StationRow[]> {
// //   const supabase = createClient();
// //   const { data, error } = await supabase
// //     .from('stations')
// //     .select('*')
// //     .order('type', { ascending: true })
// //     .order('display_order', { ascending: true });
// //   if (error) throw new Error(error.message);
// //   return data ?? [];
// // }

// const STATUS_STYLES: Record<OperationalStatus, string> = {
//   active: 'text-cyan-300 border-cyan-400/40',
//   maintenance: 'text-amber-300 border-amber-400/40',
//   offline: 'text-red-400 border-red-400/40',
// };

// const TYPE_LABELS: Record<StationType, string> = {
//   pc: 'PC',
//   ps5: 'PS5',
//   racing: 'Racing Sim',
//   vr: 'VR',
// };

// export default function StationsPage() {
//   const queryClient = useQueryClient();
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editingStation, setEditingStation] = useState<
//     StationRow | undefined
//   >();

//   const { data: stations = [], isLoading } = useQuery({
//     queryKey: stationKeys.all,
//     queryFn: fetchAdminStations,
//   });

//   const deleteMutation = useDeleteStation();
//   const statusMutation = useUpdateStationStatus();

//   const grouped = stations.reduce<Record<string, StationRow[]>>((acc, s) => {
//     (acc[s.type] ??= []).push(s);
//     return acc;
//   }, {});

//   function openAdd() {
//     setEditingStation(undefined);
//     setModalOpen(true);
//   }

//   function openEdit(station: StationRow) {
//     setEditingStation(station);
//     setModalOpen(true);
//   }

//   function handleDelete(station: StationRow) {
//     if (!confirm(`Delete "${station.name}"?`)) return;
//     deleteMutation.mutate(station.id);
//   }

//   //   async function handleDelete(station: StationRow) {
//   //     if (!confirm(`Delete "${station.name}"?`)) return;
//   //     try {
//   //       await deleteStation(station.id);
//   //       toast.success('Station deleted');
//   //       queryClient.invalidateQueries({ queryKey: ['admin-stations'] });
//   //     } catch (err) {
//   //       toast.error(err instanceof Error ? err.message : 'Delete failed');
//   //     }
//   //   }

//   function handleStatusChange(station: StationRow, status: OperationalStatus) {
//     try {
//       statusMutation.mutate({ id: station.id, status });
//       toast.success(`${station.name} set to ${status}`);
//       //   queryClient.invalidateQueries({ queryKey: ['admin-stations'] });
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : 'Status update failed');
//     }
//   }

//   function handleFormSuccess() {
//     setModalOpen(false);
//     queryClient.invalidateQueries({ queryKey: ['admin-stations'] });
//   }

//   return (
//     <div className='p-6'>
//       <div className='mb-6 flex items-center justify-between'>
//         <h1 className='text-2xl font-bold text-white'>Stations</h1>
//         <button
//           onClick={openAdd}
//           className='flex items-center gap-1.5 rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300'
//         >
//           <Plus className='h-4 w-4' /> Add station
//         </button>
//       </div>

//       {isLoading ? (
//         <p className='text-white/50'>Loading...</p>
//       ) : (
//         Object.entries(grouped).map(([type, list]) => (
//           <div key={type} className='mb-8'>
//             <h2 className='mb-3 text-sm font-bold uppercase tracking-wider text-fuchsia-400'>
//               {TYPE_LABELS[type as StationType]}
//             </h2>
//             <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
//               {list.map((station) => (
//                 <div
//                   key={station.id}
//                   className='rounded-xl border border-cyan-400/20 bg-black p-4'
//                 >
//                   <div className='flex items-center justify-between'>
//                     <span className='font-bold text-cyan-300'>
//                       {station.name}
//                     </span>
//                     <div className='flex gap-1'>
//                       <button
//                         onClick={() => openEdit(station)}
//                         className='rounded p-1 text-white/60 hover:text-cyan-300'
//                       >
//                         <Pencil className='h-3.5 w-3.5' />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(station)}
//                         className='rounded p-1 text-white/60 hover:text-red-400'
//                       >
//                         <Trash2 className='h-3.5 w-3.5' />
//                       </button>
//                     </div>
//                   </div>

//                   {/* <p className='mt-1 text-xs text-white/50'>
//                     {station.status === 'booked' ? 'Booked' : 'No booking'} · ₹
//                     {station.hourly_rate}/hr
//                   </p> */}

//                   {station.type === 'pc' && station.specs && (
//                     <p className='mt-1 truncate text-[11px] text-white/40'>
//                       {station.specs.cpu} · {station.specs.gpu} ·{' '}
//                       {station.specs.ram}
//                     </p>
//                   )}

//                   <Select
//                     value={station.operational_status}
//                     onValueChange={(v) =>
//                       handleStatusChange(station, v as OperationalStatus)
//                     }
//                   >
//                     <SelectTrigger
//                       className={`mt-3 h-7 w-full text-xs ${STATUS_STYLES[station.operational_status]}`}
//                     >
//                       <SelectValue />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value='active'>Active</SelectItem>
//                       <SelectItem value='maintenance'>Maintenance</SelectItem>
//                       <SelectItem value='offline'>Offline</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}

//       <Dialog open={modalOpen} onOpenChange={setModalOpen}>
//         <DialogContent className='max-h-[90vh] overflow-y-auto border-cyan-400/40 bg-slate-950'>
//           <DialogHeader>
//             <DialogTitle className='text-white'>
//               {editingStation ? 'Edit station' : 'Add station'}
//             </DialogTitle>
//           </DialogHeader>
//           <StationForm station={editingStation} onSuccess={handleFormSuccess} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import StationForm from '../../components/stations/StationForm';
import StationCard from '@/components/StationCard';
import { fetchAdminStations, stationKeys } from '@/lib/queries/stations';
import {
  useDeleteStation,
  useUpdateStationStatus,
} from '@/hooks/use-station-mutations';
import type { StationRow, OperationalStatus, StationType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TYPE_LABELS: Record<StationType, string> = {
  pc: 'PC',
  ps5: 'PS5',
  racing: 'Racing Sim',
  vr: 'VR',
};

export default function StationsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStation, setEditingStation] = useState<
    StationRow | undefined
  >();

  const { data: stations = [], isLoading } = useQuery({
    queryKey: stationKeys.all,
    queryFn: fetchAdminStations,
  });

  const deleteMutation = useDeleteStation();
  const statusMutation = useUpdateStationStatus();

  const grouped = stations.reduce<Record<string, StationRow[]>>((acc, s) => {
    (acc[s.type] ??= []).push(s);
    return acc;
  }, {});

  const types = Object.keys(grouped) as StationType[];

  function openAdd() {
    setEditingStation(undefined);
    setModalOpen(true);
  }

  function openEdit(station: StationRow) {
    setEditingStation(station);
    setModalOpen(true);
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  function handleStatusChange(station: StationRow, status: OperationalStatus) {
    statusMutation.mutate({ id: station.id, status });
  }

  function handleFormSuccess() {
    setModalOpen(false);
  }

  return (
    <div className='p-6'>
      <div className='mb-6 flex items-center justify-between flex-col-direction-column '>
        <h1 className='text-2xl font-bold text-white'>Stations</h1>
        <button
          onClick={openAdd}
          className='flex items-center gap-1.5 rounded-md bg-cyan-400 px-4 py-2 text-sm font-bold text-black hover:bg-cyan-300'
        >
          <Plus className='h-4 w-4' /> Add station
        </button>
      </div>

      {isLoading ? (
        <p className='text-white/50'>Loading...</p>
      ) : (
        <>
          {/* Mobile: tabbed by type, < md */}
          <div className='md:hidden'>
            <Tabs defaultValue={types[0]}>
              <TabsList className='w-full'>
                {types.map((type) => (
                  <TabsTrigger key={type} value={type} className='flex-1'>
                    {TYPE_LABELS[type]}
                  </TabsTrigger>
                ))}
              </TabsList>

              {types.map((type) => (
                <TabsContent key={type} value={type} className='mt-4'>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {grouped[type].map((station) => (
                      <StationCard
                        key={station.id}
                        station={station}
                        onEdit={openEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Desktop: grouped sections, >= md */}
          <div className='hidden md:block'>
            {types.map((type) => (
              <div key={type} className='mb-8'>
                <h2 className='mb-3 text-sm font-bold uppercase tracking-wider text-fuchsia-400'>
                  {TYPE_LABELS[type]}
                </h2>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  {grouped[type].map((station) => (
                    <StationCard
                      key={station.id}
                      station={station}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                      onStatusChange={handleStatusChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className='max-h-[90vh] overflow-y-auto border-cyan-400/40 bg-slate-950'>
          <DialogHeader>
            <DialogTitle className='text-white'>
              {editingStation ? 'Edit station' : 'Add station'}
            </DialogTitle>
          </DialogHeader>
          <StationForm station={editingStation} onSuccess={handleFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
