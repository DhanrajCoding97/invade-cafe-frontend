import { getCustomers } from '@/lib/queries/customers';
import { customerColumns } from '../../components/columns/customerColumns';
import { CustomersTable } from '../../components/CustomerTable';

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <div className='flex flex-col gap-5'>
      <div>
        <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold '>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Customers
          </span>
        </h2>
        <p className='max-w-[80ch] text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] leading-6 text-[#bcbcbc]'>
          View customer accounts, booking activity, and manage staff access.
        </p>
      </div>
      {/* <div className='flex w-fit items-center gap-4 border border-white/10 bg-white/2 px-5 py-3'>
        <div className='flex'>
          <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            Total Customers
          </p>
          <p className='text-xl font-bold leading-tight text-white'>
            {customers.length}
          </p>
        </div>
      </div> */}
      <div className='min-h-10.5 rounded-lg max-w-fit flex items-center gap-2 border border-[#28F1FF]/20 bg-[#0C1617] px-3 py-1.5'>
        <span className='font-mono text-xs font-semibold text-[#28F1FF]/70'>
          Total Customers :
        </span>
        <span className='font-mono text-[10px] uppercase tracking-wider text-white'>
          {customers.length}
        </span>
      </div>
      <CustomersTable columns={customerColumns} data={customers} />
    </div>
  );
}
