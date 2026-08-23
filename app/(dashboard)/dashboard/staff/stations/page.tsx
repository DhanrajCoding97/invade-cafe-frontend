'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import StationForm from '../../components/stations/StationForm';
import StationCard from '@/components/StationCard';
import { fetchAdminStations, stationKeys } from '@/lib/queries/stations';
import { useUpdateStationOperationalStatus } from '@/hooks/use-station-mutations';
import type { StationRow, OperationalStatus, StationType } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { StationsSkeleton } from '@/components/skeletons/StationSkeleton';
import { Button } from '@/components/ui/button';

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

  // const deleteMutation = useDeleteStation();
  const operationalStatusMutation = useUpdateStationOperationalStatus();
  const grouped = useMemo(() => {
    const result = stations.reduce<Record<string, StationRow[]>>(
      (acc, station) => {
        (acc[station.type] ??= []).push(station);
        return acc;
      },
      {},
    );

    Object.values(result).forEach((group) => {
      group.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, {
          numeric: true,
          sensitivity: 'base',
        }),
      );
    });

    return result;
  }, [stations]);
  // const grouped = stations.reduce<Record<string, StationRow[]>>((acc, s) => {
  //   (acc[s.type] ??= []).push(s);
  //   return acc;
  // }, {});
  const TYPE_ORDER: StationType[] = ['pc', 'ps5', 'vr', 'racing'];

  const types = TYPE_ORDER.filter((type) => grouped[type]?.length);
  // const types = Object.keys(grouped) as StationType[];

  function openAdd() {
    setEditingStation(undefined);
    setModalOpen(true);
  }

  function openEdit(station: StationRow) {
    setEditingStation(station);
    setModalOpen(true);
  }

  function handleStatusChange(
    station: StationRow,
    operational_status: OperationalStatus,
  ) {
    operationalStatusMutation.mutate({ id: station.id, operational_status });
  }

  function handleFormSuccess() {
    setModalOpen(false);
  }

  return (
    <div className='@container flex flex-col gap-5'>
      <div className='@2xl:flex-row flex flex-col @2xl:items-center justify-between gap-2'>
        <div>
          <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold '>
            <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
              Stations
            </span>
          </h2>
          <p className='max-w-[80ch] text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] leading-6 text-[#bcbcbc]'>
            Manage your PCs, consoles, racing simulators, and other gaming
            stations.
          </p>
        </div>
        <Button
          variant='cyber'
          glow={false}
          onClick={openAdd}
          className='max-w-fit border-emerald-400/50 bg-[#0a160f] text-emerald-400 [text-shadow:0_0_8px_rgba(52,211,153,0.7)] hover:border-emerald-400 hover:bg-emerald-400/10 flex items-center gap-1.5 px-4 py-2 text-sm font-bold'
        >
          <span>Add Station</span>
          <Plus className='h-4 w-4' aria-hidden='true' />
        </Button>
      </div>

      {isLoading ? (
        <StationsSkeleton />
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
                <TabsContent key={type} value={type}>
                  <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                    {grouped[type].map((station) => (
                      <StationCard
                        key={station.id}
                        station={station}
                        onEdit={openEdit}
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
                <div className='mb-3 flex items-center gap-3'>
                  <h3 className='text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-400/70'>
                    {TYPE_LABELS[type]}
                  </h3>
                  <span className='h-px flex-1 bg-linear-to-r from-cyan-500/30 to-transparent' />
                </div>

                {/* <h2 className='mb-3 text-sm font-bold uppercase tracking-wider text-fuchsia-400'></h2> */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  {grouped[type].map((station) => (
                    <StationCard
                      key={station.id}
                      station={station}
                      onEdit={openEdit}
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
        <DialogContent className='max-h-[90vh] overflow-y-auto bg-[#080a0d] border border-cyan-500/10 '>
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
