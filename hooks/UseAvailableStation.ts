import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { stationKeys, fetchAvailableStations } from '@/lib/queries/stations';

// export function useAvailableStations(window: {
//   device: 'pc' | 'ps5' | 'vr' | 'racing';
//   date: string;
//   startTime: string;
//   duration: number;
//   excludeBookingId?: string;
// }) {
//   return useQuery({
//     queryKey: stationKeys.available(
//       window.device,
//       window.date,
//       window.startTime,
//       window.duration,
//       window.excludeBookingId,
//     ),
//     queryFn: () => fetchAvailableStations(window),
//     enabled:
//       !!window.device &&
//       !!window.date &&
//       !!window.startTime &&
//       !!window.duration,
//     placeholderData: keepPreviousData,
//   });
// }
export function useAvailableStations(window: {
  device: 'pc' | 'ps5' | 'vr' | 'racing';
  tier?: string;
  date: string;
  startTime: string;
  duration: number;
  excludeBookingId?: string;
}) {
  return useQuery({
    queryKey: stationKeys.available(
      window.device,
      window.tier,
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
    placeholderData: keepPreviousData,
  });
}
