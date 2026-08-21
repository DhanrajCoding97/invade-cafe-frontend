import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function BookingsTableSkeleton() {
  return (
    <div className='w-full'>
      {/* =========================
          MOBILE
          ========================= */}
      <div className='md:hidden'>
        {/* Top icon */}
        <Skeleton className='mb-6 h-5 w-5 rounded-sm' />

        {/* Heading */}
        <div className='mb-6 space-y-2'>
          <Skeleton className='h-8 w-32 rounded-md' />
          <Skeleton className='h-4 w-24 rounded-md' />
        </div>

        {/* Search */}
        <Skeleton className='mb-3 h-11 w-full rounded-md' />

        {/* Filters */}
        <Skeleton className='mb-5 h-11 w-full rounded-md' />

        {/* Booking cards */}
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='rounded-xl border border-cyan-400/40 p-4'>
              {/* Customer + status */}
              <div className='mb-5 flex items-start justify-between gap-4'>
                <div className='space-y-2'>
                  <Skeleton className='h-4 w-24 rounded-md' />
                  <Skeleton className='h-3 w-32 rounded-md' />
                </div>

                <Skeleton className='h-4 w-16 rounded-full' />
              </div>

              {/* Booking details */}
              <div className='space-y-3'>
                {Array.from({ length: 6 }).map((_, j) => (
                  <div
                    key={j}
                    className='flex items-center justify-between gap-4'
                  >
                    <Skeleton className='h-3 w-20 rounded-md' />
                    <Skeleton className='h-3 w-24 rounded-md' />
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className='mt-5 flex items-center justify-between border-t border-cyan-400/20 pt-4'>
                <Skeleton className='h-3 w-14 rounded-md' />
                <Skeleton className='h-6 w-12 rounded-md' />
              </div>

              {/* Action */}
              <Skeleton className='mt-4 h-10 w-full rounded-md' />
            </div>
          ))}
        </div>
      </div>

      {/* =========================
          DESKTOP
          ========================= */}
      <div className='hidden md:block'>
        {/* Header */}
        <div className='mb-6 flex items-start justify-between'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-32 rounded-md' />
            <Skeleton className='h-4 w-24 rounded-md' />
          </div>

          <Skeleton className='h-10 w-40 rounded-md' />
        </div>

        {/* Search */}
        <Skeleton className='mb-6 h-11 w-full rounded-md' />

        {/* Filters */}
        <div className='mb-11 flex items-center gap-3'>
          <Skeleton className='h-11 w-56 rounded-md' />
          <Skeleton className='h-11 w-48 rounded-md' />
          <Skeleton className='h-11 w-48 rounded-md' />
        </div>

        {/* Table */}
        <div className='overflow-hidden rounded-lg border border-cyan-400/20'>
          {/* Header */}
          <div className='grid grid-cols-9 gap-4 border-b border-cyan-400/20 px-5 py-4'>
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className='h-4 w-16 rounded-md' />
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <div
              key={rowIndex}
              className='grid grid-cols-9 items-center gap-4 border-b border-cyan-400/10 px-5 py-4 last:border-b-0'
            >
              {/* Customer */}
              <div className='space-y-2'>
                <Skeleton className='h-4 w-20 rounded-md' />
                <Skeleton className='h-3 w-28 rounded-md' />
              </div>

              {/* Device */}
              <Skeleton className='h-4 w-8 rounded-md' />

              {/* Date & time */}
              <div className='space-y-2'>
                <Skeleton className='h-4 w-16 rounded-md' />
                <Skeleton className='h-3 w-12 rounded-md' />
              </div>

              {/* Duration */}
              <Skeleton className='h-4 w-10 rounded-md' />

              {/* Players */}
              <Skeleton className='h-4 w-8 rounded-md' />

              {/* Amount */}
              <Skeleton className='h-4 w-10 rounded-md' />

              {/* Payment */}
              <div className='space-y-2'>
                <Skeleton className='h-5 w-14 rounded-full' />
                <Skeleton className='h-3 w-16 rounded-md' />
              </div>

              {/* Status */}
              <Skeleton className='h-6 w-16 rounded-full' />

              {/* Actions */}
              <div className='flex gap-3'>
                <Skeleton className='h-5 w-5 rounded-md' />
                <Skeleton className='h-5 w-5 rounded-md' />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className='mt-5 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Skeleton className='h-4 w-24 rounded-md' />
            <Skeleton className='h-10 w-24 rounded-md' />
          </div>

          <div className='flex items-center gap-3'>
            <Skeleton className='h-4 w-20 rounded-md' />
            <Skeleton className='h-10 w-20 rounded-md' />
            <Skeleton className='h-10 w-20 rounded-md' />
          </div>
        </div>
      </div>
    </div>
  );
}
