// app/dashboard/staff/LiveSessionBoard.tsx
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { startSession, endSession, extendSession } from '../actions';

type Booking = {
  id: string;
  station_id: string;
  date: string;
  start_time: string;
  duration_hours: string | number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  session_started_at: string | null;
  session_ended_at: string | null;
  extended_until: string | null;
  profiles: { full_name: string } | null;
};

type Station = { id: string; name: string; type: string };

function StationCard({
  station,
  booking,
}: {
  station: Station;
  booking?: Booking;
}) {
  const isActive = !!booking?.session_started_at && !booking?.session_ended_at;
  const isBooked = !!booking && !isActive;

  let timeLeft: number | null = null;
  if (isActive && booking?.session_started_at) {
    const actualEnd = new Date(booking.session_started_at);
    actualEnd.setHours(actualEnd.getHours() + Number(booking.duration_hours));
    const end = booking.extended_until ?? actualEnd.toISOString();
    timeLeft = getTimeLeft(end);
  }

  return (
    <div
      className={`rounded-xl border p-4 flex flex-col gap-2 ${
        isActive
          ? 'border-cyan-400 bg-cyan-400/10'
          : isBooked
            ? 'border-fuchsia-500/50 bg-fuchsia-500/5'
            : 'border-neutral-800 bg-neutral-900'
      }`}
    >
      <div className='flex justify-between items-center'>
        <span className='font-semibold text-sm'>{station.name}</span>
        <span
          className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isActive
              ? 'bg-cyan-400 text-black'
              : isBooked
                ? 'bg-fuchsia-500 text-black'
                : 'bg-neutral-700 text-neutral-300'
          }`}
        >
          {isActive ? 'Active' : isBooked ? 'Booked' : 'Free'}
        </span>
      </div>

      {booking ? (
        <>
          <p className='text-sm text-neutral-300'>
            {booking.profiles?.full_name ?? 'Guest'}
          </p>
          <p className='text-xs text-neutral-500'>
            {booking.start_time.slice(0, 5)}
          </p>
          {timeLeft !== null && (
            <p
              className={`text-xs font-mono ${timeLeft <= 5 ? 'text-red-400' : 'text-cyan-300'}`}
            >
              {timeLeft} min left
            </p>
          )}

          <div className='flex gap-2 mt-2'>
            {isBooked && (
              <button
                onClick={() => startSession(booking.id)}
                className='text-xs px-3 py-1.5 rounded-md bg-cyan-400 text-black font-medium'
              >
                Start
              </button>
            )}
            {isActive && (
              <>
                <button
                  onClick={() => endSession(booking.id)}
                  className='text-xs px-3 py-1.5 rounded-md bg-red-500/80 text-white font-medium'
                >
                  End
                </button>
                <button
                  onClick={async () => {
                    const res = await extendSession(booking.id, station.id, 30);
                    if (!res.ok)
                      alert('Station is booked right after — cannot extend.');
                  }}
                  className='text-xs px-3 py-1.5 rounded-md bg-neutral-700 text-white font-medium'
                >
                  +30m
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <p className='text-xs text-neutral-500'>No booking</p>
      )}
    </div>
  );
}

function getTimeLeft(endIso: string) {
  return Math.max(
    0,
    Math.round((new Date(endIso).getTime() - Date.now()) / 60_000),
  );
}

const STATION_TYPES = [
  { key: 'pc', label: 'PC' },
  { key: 'ps5', label: 'PS5' },
  { key: 'racing', label: 'Racing Sim' },
] as const;

type StationType = (typeof STATION_TYPES)[number]['key'];

export default function LiveSessionBoard({
  stations,
  initialBookings,
}: {
  stations: Station[];
  initialBookings: Booking[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeType, setActiveType] = useState<StationType>('pc');
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('bookings-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        (payload) => {
          setBookings((prev) => {
            if (payload.eventType === 'INSERT')
              return [...prev, payload.new as Booking];
            if (payload.eventType === 'UPDATE')
              return prev.map((b) =>
                b.id === payload.new.id
                  ? ({ ...b, ...payload.new } as Booking)
                  : b,
              );
            if (payload.eventType === 'DELETE')
              return prev.filter((b) => b.id !== payload.old.id);
            return prev;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const currentBookingFor = (stationId: string) =>
    bookings
      .filter((b) => b.station_id === stationId && b.status === 'confirmed')
      .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

  const groupedStations = STATION_TYPES.map(({ key, label }) => ({
    key,
    label,
    stations: stations.filter((s) => s.type === key),
  }));

  // quick "active count" per group so staff glance the tab to see where the action is
  const activeCountFor = (type: StationType) =>
    stations
      .filter((s) => s.type === type)
      .filter((s) => {
        const b = currentBookingFor(s.id);
        return !!b?.session_started_at && !b?.session_ended_at;
      }).length;

  return (
    <div>
      <h2 className='text-lg font-semibold mb-3'>Live Sessions Board</h2>

      {/* Mobile: tab switcher instead of scrolling through everything */}
      <div className='flex sm:hidden gap-2 mb-4 overflow-x-auto'>
        {groupedStations.map(({ key, label, stations: groupStations }) => {
          if (groupStations.length === 0) return null;
          const activeCount = activeCountFor(key);
          return (
            <button
              key={key}
              onClick={() => setActiveType(key)}
              className={`flex items-center gap-2 shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeType === key
                  ? 'bg-cyan-400 text-black'
                  : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              {label}
              {activeCount > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    activeType === key
                      ? 'bg-black/20'
                      : 'bg-cyan-400 text-black'
                  }`}
                >
                  {activeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop/tablet: all groups stacked with headers, no tab needed */}
      <div className='flex flex-col gap-8'>
        {groupedStations.map(({ key, label, stations: groupStations }) => {
          if (groupStations.length === 0) return null;
          return (
            <section
              key={key}
              className={`${activeType === key ? 'block' : 'hidden'} sm:block`}
            >
              <h3 className='hidden sm:block text-sm uppercase tracking-[0.2em] text-fuchsia-400 font-semibold mb-3'>
                {label}
              </h3>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 live-session-grid'>
                {groupStations.map((station) => (
                  <StationCard
                    key={station.id}
                    station={station}
                    booking={currentBookingFor(station.id)}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
