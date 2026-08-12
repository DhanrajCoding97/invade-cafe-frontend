'use client';
import { ColumnDef } from '@tanstack/react-table';
import { type BookingRow } from '@/types';
import { BookingActions } from '@/app/actions/booking-actions';
import {
  Banknote,
  CreditCard,
  Smartphone,
  Gift,
  type LucideIcon,
} from 'lucide-react';

const paymentColor = {
  paid: 'green',
  pending: '#facc15',
  failed: '#ef4444',
  refunded: '#9ca3af',
} as const;

const PAYMENT_ICONS: Record<string, LucideIcon> = {
  cash: Banknote,
  razorpay: CreditCard,
  upi_manual: Smartphone,
  complimentary: Gift,
};

export const bookingColumns: ColumnDef<BookingRow>[] = [
  {
    id: 'customer',
    header: 'Customer',
    accessorFn: (row) =>
      `${row.customer_name ?? row.profiles?.full_name ?? 'Walk-in'} ${row.customer_phone ?? row.profiles?.phone ?? ''}`,
    cell: ({ row }) => {
      const name =
        row.original.customer_name ??
        row.original.profiles?.full_name ??
        'Walk-in';
      const phone =
        row.original.customer_phone ?? row.original.profiles?.phone ?? '—';
      const isOnline = !!row.original.user_id;

      return (
        <div>
          <div className='flex items-center gap-1.5 font-medium'>
            {name}
            {isOnline && (
              <span className='rounded bg-[#07200D] px-1.5 py-0.5 text-[10px] text-[#39FF6E]'>
                Online
              </span>
            )}
          </div>
          <div className='text-xs text-muted-foreground'>{phone}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'device',
    header: 'Device',
    accessorFn: (row) => row.device,
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
    accessorFn: (row) => row.amount,
    header: 'Amount',
    cell: ({ row }) => {
      const b = row.original;
      const isOnlineBooking = b.payment_method === 'razorpay';
      const extensions = b.session_extensions ?? [];
      const pendingExtension = extensions.find(
        (e) => e.payment_status === 'pending',
      );
      const extensionTotal = extensions.reduce((sum, e) => sum + e.amount, 0);

      if (isOnlineBooking) {
        // base is genuinely paid via Razorpay — show base, flag any unpaid extension separately
        return (
          <div className='flex flex-col gap-0.5'>
            <span>₹{Number(b.amount).toFixed(0)}</span>
            {pendingExtension && (
              <span className='text-[10px] text-amber-400'>
                +₹{pendingExtension.amount} ext unpaid
              </span>
            )}
          </div>
        );
      }

      // offline — everything collected together, show running total
      const total = Number(b.amount) + extensionTotal;
      return (
        <div className='flex flex-col gap-0.5'>
          <span>₹{total.toFixed(0)}</span>
          {extensionTotal > 0 && (
            <span className='text-[10px] text-muted-foreground'>
              incl. ₹{extensionTotal} ext
            </span>
          )}
        </div>
      );
    },
  },
  // {
  //   id: 'payment',
  //   header: 'Payment',
  //   cell: ({ row }) => {
  //     const { payment_method, payment_status } = row.original;
  //     const statusStyles: Record<string, string> = {
  //       paid: 'bg-green-100 text-green-700',
  //       pending: 'bg-yellow-100 text-yellow-700',
  //       failed: 'bg-red-100 text-red-700',
  //       refunded: 'bg-gray-100 text-gray-700',
  //     };
  //     return (
  //       <div className='space-y-1'>
  //         <span
  //           className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[payment_status]}`}
  //         >
  //           {payment_status}
  //         </span>
  //         <div className='text-xs capitalize text-muted-foreground'>
  //           {payment_method?.replace('_', ' ') ?? '—'}
  //         </div>
  //       </div>
  //     );
  //   },
  // },
  {
    id: 'payment',
    header: 'Payment',
    cell: ({ row }) => {
      const b = row.original;
      const Icon = b.payment_method ? PAYMENT_ICONS[b.payment_method] : null;
      const styles: Record<string, string> = {
        paid: 'bg-[#07200D] text-[#39FF6E]',
        pending: 'bg-amber-800 text-amber-200',
        failed: 'bg-red-100 text-red-700',
        refunded: 'bg-blue-800 text-blue-200',
      };
      return (
        <div className='flex flex-col gap-0.5 items-start justify-center'>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${styles[b.payment_status]}`}
          >
            {b.payment_status}
          </span>
          <div className='flex items-center gap-1 text-xs text-muted-foreground justify-center'>
            {Icon && <Icon className='h-3 w-3' />}
            {b.payment_method ?? '—'}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    accessorFn: (row) => row.payment_status,
    cell: ({ row }) => {
      const status = row.original.status;
      const styles: Record<string, string> = {
        confirmed: 'bg-blue-100 text-blue-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        no_show: 'bg-amber-100 text-amber-700',
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
    header: 'Actions',
    cell: ({ row, table }) => (
      <BookingActions booking={row.original} role={table.options?.meta?.role} />
    ),
  },
];
