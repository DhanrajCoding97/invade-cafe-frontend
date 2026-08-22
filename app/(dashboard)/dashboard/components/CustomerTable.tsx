// customers-table.tsx
'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getCustomersClient, customerKeys } from '@/lib/queries/customers';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import { type PaginationState, SortingState } from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import CustomerCard from './CustomerCard';
import { CustomerRow } from '@/types';
import { useRealtimeCustomers } from '@/hooks/use-realtime-customers';
import { useQuery } from '@tanstack/react-query';
interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function CustomersTable({
  columns,
  data: initialData,
  loading: externalLoading = false,
  error = null,
  onRetry,
}: DataTableProps<CustomerRow>) {
  useRealtimeCustomers();
  const { data = [], isLoading } = useQuery({
    queryKey: customerKeys.all,
    queryFn: getCustomersClient,
    initialData,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const tableData = useMemo(() => data, [data]);
  const tableColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  return (
    <>
      {isLoading && (
        <div className='mb-4 flex items-center gap-3 text-gray-400'>
          <svg
            className='h-5 w-5 animate-spin'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
          >
            <circle
              className='opacity-25'
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='4'
            />
            <path
              className='opacity-75'
              fill='currentColor'
              d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
            />
          </svg>
          Loading customers…
        </div>
      )}

      {error && (
        <div className='mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800'>
          <span className='font-medium'>Error:</span> {error}
          <button
            onClick={onRetry}
            className='ml-3 underline hover:no-underline'
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && (
        <>
          <div className='relative w-full max-w-sm mb-4'>
            <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#28F1FF]/70' />
            <Input
              type='text'
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder='Search name, email, phone...'
              className='h-10 rounded-lg border border-[#28F1FF]/20 bg-white/5 pl-10 pr-10 text-white placeholder:text-white/40 transition-all focus:border-[#28F1FF] focus:ring-2 focus:ring-[#28F1FF]/20'
            />
            {globalFilter && (
              <button
                type='button'
                onClick={() => setGlobalFilter('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white'
              >
                ✕
              </button>
            )}
          </div>

          {/* ---------- Mobile: cards (below md) ---------- */}
          <div className='flex flex-col gap-3 md:hidden'>
            {rows.length ? (
              rows.map((row) => (
                <CustomerCard
                  key={row.id}
                  customer={row.original as unknown as CustomerRow}
                />
              ))
            ) : (
              <div className='rounded-lg border border-white/10 px-4 py-6 text-center text-sm text-muted-foreground'>
                No customers found.
              </div>
            )}
          </div>
          {/*/* ---------- Desktop: table (md and up) ---------- */}
          <div className='hidden md:block overflow-x-auto rounded-lg border'>
            <table className='w-full text-sm border-collapse shadow-lg'>
              <thead className='bg-muted/50'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className='cursor-pointer select-none px-4 py-2 text-left font-medium'
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{ asc: ' ↑', desc: ' ↓' }[
                          header.column.getIsSorted() as string
                        ] ?? ''}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className='border-t hover:bg-muted/30'>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className='px-4 py-2'>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className='px-4 py-6 text-center text-muted-foreground'
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className='flex items-center justify-between mt-4'>
            <div className='flex items-center gap-2 text-sm text-muted-foreground'>
              Rows per page:
              <select
                value={pagination.pageSize}
                onChange={(e) =>
                  setPagination((prev) => ({
                    ...prev,
                    pageSize: Number(e.target.value),
                    pageIndex: 0,
                  }))
                }
                className='bg-transparent border rounded px-2 py-1'
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className='flex items-center gap-2'>
              <span className='text-sm text-muted-foreground'>
                Page {pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                ← Prev
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next →
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
