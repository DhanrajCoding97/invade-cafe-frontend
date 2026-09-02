import { type CustomerRow } from '@/types';
import { RoleSelect } from './role-select';
import { format } from 'date-fns';
export default function CustomerCard({ customer }: { customer: CustomerRow }) {
  return (
    <div className='rounded-xl border border-[#28F1FF]/20 bg-black p-4'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='truncate font-medium text-white'>
            {customer.full_name ?? 'No name'}
          </p>
          <p className='truncate text-sm text-[#28F1FF]'>
            {customer.email ?? '-'}
          </p>
          <p className='text-sm text-white/50'>{customer.phone ?? '-'}</p>
        </div>

        <div className='shrink-0'>
          <RoleSelect customer={customer} />
        </div>
      </div>

      <div className='mt-3 flex gap-6 border-t border-white/10 pt-3'>
        <div>
          <p className='text-xs text-white/40'>Bookings</p>
          <p className='text-sm font-medium text-white'>
            {customer.booking_count}
          </p>
        </div>
        <div>
          <p className='text-xs text-white/40'>Joined</p>
          <p className='text-sm font-medium text-white'>
            {format(new Date(customer.created_at), 'dd MMM yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
}
