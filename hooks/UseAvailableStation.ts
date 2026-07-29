// import { useQuery } from '@tanstack/react-query';
// import { stationKeys, fetchAvailableStations } from '@/lib/queries/stations';

// export function useAvailableStations(window: {
//   date: string;
//   startTime: string;
//   duration: number;
// }) {
//   return useQuery({
//     queryKey: stationKeys.available(
//       window.date,
//       window.startTime,
//       window.duration,
//     ),
//     queryFn: () => fetchAvailableStations(window),
//     enabled: !!window.date && !!window.startTime && !!window.duration,
//   });
// }
// device: 'pc' | 'ps5' | 'vr' | 'racing';

import { useQuery } from '@tanstack/react-query';
import { stationKeys, fetchAvailableStations } from '@/lib/queries/stations';

export function useAvailableStations(window: {
  device: 'pc' | 'ps5' | 'vr' | 'racing';
  date: string;
  startTime: string;
  duration: number;
  excludeBookingId?: string;
}) {
  return useQuery({
    queryKey: stationKeys.available(
      window.device,
      window.date,
      window.startTime,
      window.duration,
      window.excludeBookingId,
    ),
    queryFn: () => fetchAvailableStations(window),
    enabled:
      !!window.device &&
      !!window.date &&
      !!window.startTime &&
      !!window.duration,
  });
}
