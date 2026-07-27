'use client';
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
}

export function BookingsTable<TData>({ columns, data }: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter,setGlobalFilter] = useState("")

  const tableData = useMemo(() => data, [data])
  const tableColumns = useMemo(() => columns,[columns])

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: { 
      sorting,
      globalFilter
     },
    onSortingChange: setSorting,
    onGlobalFilterChange : setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel()
  });

  return (
    <>
<div className="relative w-full max-w-sm">
  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#28F1FF]/70" />

  <Input
    type="text"
    value={globalFilter}
    onChange={(e) => setGlobalFilter(e.target.value)}
    placeholder="Search customer, phone, device..."
    className="
      h-10
      rounded-lg
      border border-[#28F1FF]/20
      bg-white/5
      pl-10
      pr-10
      text-white
      placeholder:text-white/40
      transition-all
      focus:border-[#28F1FF]
      focus:ring-2
      focus:ring-[#28F1FF]/20
    "
  />

  {globalFilter && (
    <button
      type="button"
      onClick={() => setGlobalFilter('')}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition hover:text-white"
    >
      ✕
    </button>
  )}
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    </>
  );
}
