//column def for tanstack table
// columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { type BookingRow } from '@/types';
import { BookingActions } from '@/app/actions/booking-actions';

export const bookingColumns: ColumnDef<BookingRow>[] = [
  {
    id: 'customer',
    header: 'Customer',
    cell: ({ row }) => (
      <div>
        <div className='font-medium'>
          {row.original.customer_name ?? 'Walk-in'}
        </div>
        <div className='text-xs text-muted-foreground'>
          {row.original.customer_phone ?? '—'}
        </div>
      </div>
    ),
  },
  {
    accessorKey: 'device',
    header: 'Device',
    cell: ({ row }) => (
      <span className='capitalize'>{row.original.device}</span>
    ),
  },
  {
    id: 'datetime',
    header: 'Date & Time',
    accessorFn: (row) => `${row.date} ${row.start_time}`,
    cell: ({ row }) => {
      const { date, start_time } = row.original;
      return (
        <div>
          <div>
            {new Date(date).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
            })}
          </div>
          <div className='text-xs text-muted-foreground'>
            {start_time.slice(0, 5)}
          </div>
        </div>
      );
    },
  },
  {
    id: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const h = row.original.duration_hours ?? row.original.duration;
      return h ? `${h}h` : '—';
    },
  },
  {
    accessorKey: 'players',
    header: 'Players',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `₹${Number(row.original.amount).toFixed(0)}`,
  },
  {
    id: 'payment',
    header: 'Payment',
    cell: ({ row }) => {
      const { payment_method, payment_status } = row.original;
      const statusStyles: Record<string, string> = {
        paid: 'bg-green-100 text-green-700',
        pending: 'bg-yellow-100 text-yellow-700',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-gray-100 text-gray-700',
      };
      return (
        <div className='space-y-1'>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[payment_status]}`}
          >
            {payment_status}
          </span>
          <div className='text-xs capitalize text-muted-foreground'>
            {payment_method?.replace('_', ' ') ?? '—'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      const styles: Record<string, string> = {
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
      };
      return (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <BookingActions booking={row.original} />,
  },
];
