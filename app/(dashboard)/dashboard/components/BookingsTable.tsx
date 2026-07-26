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

  const tableData = useMemo(() => data, [])
  const tableColumns = useMemo(() => columns,[])

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
      <div className='overflow-x-auto rounded-lg border'>
        <div className="relative w-full p-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            type="text"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search..."
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 shadow-sm transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
      </div>
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
  );
}
