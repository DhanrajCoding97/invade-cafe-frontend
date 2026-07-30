// customer-columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { type CustomerRow } from '@/types';
import { RoleSelect } from '../role-select';

export const customerColumns: ColumnDef<CustomerRow>[] = [
  {
    accessorKey: 'full_name',
    header: 'Customer',
    cell: ({ row }) => (
      <div>
        <p className='font-medium'>{row.original.full_name ?? 'No name'}</p>
        <p className='text-xs text-muted-foreground'>
          {row.original.phone ?? '-'}
        </p>
      </div>
    ),
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => row.original.email ?? '-',
  },
  {
    accessorKey: 'booking_count',
    header: 'Bookings',
  },
  {
    accessorKey: 'created_at',
    header: 'Joined',
    cell: ({ row }) => format(new Date(row.original.created_at), 'dd MMM yyyy'),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <RoleSelect customer={row.original} />,
  },
];
