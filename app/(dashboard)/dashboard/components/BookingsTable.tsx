'use client';
import { ArrowUp, ArrowDown } from "lucide-react";
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { type DateRange } from 'react-day-picker';
import { isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns';
import { BookingDateFilter } from './filters/booking-date-filter';
import { BookingStatusFilter } from './filters/booking-status-filter';
import { BookingPaymentFilter } from './filters/booking-payment-filter';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
} from '@tanstack/react-table';
import {
  type PaginationState,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

function exportBookingsToCSV(rows: any[]) {
  if (rows.length === 0) return;

  const headers = [
    'Customer',
    'Phone',
    'Device',
    'Date',
    'Start Time',
    'Duration (hrs)',
    'Players',
    'Amount',
    'Payment Method',
    'Payment Status',
    'Status',
  ];

  const csvRows = rows.map((row) => [
    row.customer_name ?? row.profiles?.full_name ?? '',
    row.customer_phone ?? row.profiles?.phone ?? '',
    row.device ?? '',
    row.date ?? '',
    row.start_time ?? '',
    row.duration_hours ?? '',
    row.players ?? '',
    row.amount ?? '',
    row.payment_method ?? '',
    row.payment_status ?? '',
    row.status ?? '',
  ]);

  // Escape commas/quotes/newlines so Excel doesn't misparse names or notes
  const escapeCell = (val: any) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [headers, ...csvRows]
    .map((row) => row.map(escapeCell).join(','))
    .join('\n');

  // BOM prefix so Excel renders ₹ and other non-ASCII characters correctly
  const blob = new Blob(['\uFEFF' + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;

  const today = new Date().toISOString().slice(0, 10);
  link.download = `bookings-${today}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export function BookingsTable<TData>({
  columns,
  data,
  loading = false,
  error = null,
  onRetry,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  // default to today
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const tableData = useMemo(() => {
    let rows = data as any[];

    if (dateRange?.from) {
      const from = startOfDay(dateRange.from);
      const to = endOfDay(dateRange.to ?? dateRange.from);
      rows = rows.filter((row) =>
        isWithinInterval(parseISO(row.date), { start: from, end: to }),
      );
    }

    if (statusFilter !== 'all') {
      rows = rows.filter((row) => row.status === statusFilter);
    }

    if (paymentFilter !== 'all') {
      rows = rows.filter((row) => row.payment_status === paymentFilter);
    }

    return rows;
  }, [data, dateRange, statusFilter, paymentFilter]);

  const tableColumns = useMemo(() => columns, [columns]);

  // clear filter button
  const hasActiveFilters =
    statusFilter !== 'all' ||
    paymentFilter !== 'all' ||
    !!dateRange?.from ||
    !!globalFilter;

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
      pagination,
      columnFilters,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      {/* Loading spinner */}
      {loading ? (
        <div className='flex items-center gap-3 text-gray-600 py-8 justify-center'>
          <svg className='h-5 w-5 animate-spin' /* ... */ />
          Loading bookings…
        </div>
      ) : error ? (
        <div className='mb-4 rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800'>
          <span className='font-medium'>Error:</span> {error}
          <button
            // onClick={refetch}
            className='ml-3 underline hover:no-underline'
          >
            Retry
          </button>
        </div>
      ) : (
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col justify-center gap-3'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
              <h1 className='text-2xl font-bold'>Bookings Table</h1>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  exportBookingsToCSV(
                    table.getFilteredRowModel().rows.map((r) => r.original),
                  )
                }
                disabled={table.getFilteredRowModel().rows.length === 0}
              >
                Export CSV
              </Button>
            </div>
            <p className='text-sm text-muted-foreground'>
              Total bookings: {table.getFilteredRowModel().rows.length}
            </p>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='relative w-full max-w-sm'>
                <Search className='pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#28F1FF]/70' />
                <Input
                  type='text'
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder='Search customer, phone, device...'
                  className='
              h-10
              rounded-lg
              border border-[#28F1FF]/20
              bg-white/5
              text-white
              placeholder:text-white/40
              pl-10
              pr-10
              transition-all
              focus:border-[#28F1FF]
              focus:ring-2
              focus:ring-[#28F1FF]/20
            '
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
              <BookingDateFilter date={dateRange} onChange={setDateRange} />
              <BookingStatusFilter
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <BookingPaymentFilter
                value={paymentFilter}
                onChange={setPaymentFilter}
              />
              {hasActiveFilters && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setStatusFilter('all');
                    setPaymentFilter('all');
                    setDateRange(undefined);
                    setGlobalFilter('');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          </div>
          <div className='overflow-x-auto rounded-lg border'>
            <table className='w-full text-sm border-collapse shadow-lg'>
              <thead className='bg-muted/50'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                     <th
  key={header.id}
  onClick={header.column.getToggleSortingHandler()}
  className="cursor-pointer select-none px-4 py-2 text-left font-medium min-w-[120px]"
>
  <div className="flex items-center gap-1 whitespace-nowrap">
    {flexRender(
      header.column.columnDef.header,
      header.getContext(),
    )}
    <span className="shrink-0">
      {{
        asc: "↑",
        desc: "↓",
      }[header.column.getIsSorted() as string] ?? ""}
    </span>
  </div>
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
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            {/* Page size selector */}
            <div className='flex items-center gap-2 text-sm text-gray-500'>
              <Label htmlFor='page-size'>Rows per page:</Label>
              <Select
                name='page-size'
                value={String(table.getState().pagination.pageSize)}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className='w-20'>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {[5, 10, 20].map((size) => (
                    <SelectItem
                      key={size}
                      value={String(size)}
                      className='hover:bg-amber-100'
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Navigation buttons and page info */}
            <div className='flex items-center gap-2'>
              {/* "Page X of Y" indicator — uses 1-based numbering for display */}
              <span className='mr-1 text-sm text-gray-500'>
                Page {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount()}
              </span>

              {/* Previous button — disabled on first page */}
              <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className='rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
              >
                ← Prev
              </button>

              {/* Next button — disabled on last page */}
              <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className='rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40'
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
