import { getCustomers } from '@/lib/queries/customers';
import { customerColumns } from '../../components/columns/customerColumns';
import { CustomersTable } from '../../components/CustomerTable';

export default async function CustomersPage() {
  const customers = await getCustomers();
  console.log('customers', customers);
  return (
    <div className='flex flex-col gap-3'>
      <div>
        <h2 className='text-[clamp(1.5rem,1.2rem+1vw,2.25rem)] font-extrabold '>
          <span className='bg-linear-to-r from-[#28F1FF] to-[#FE11FF] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]'>
            Cafe Settings
          </span>
        </h2>
        <p className='max-w-[80ch] text-[clamp(0.875rem,0.8rem+0.3vw,1rem)] leading-6 text-[#bcbcbc]'>
          Manage your cafe's operating hours, pricing, and general settings.
        </p>
      </div>
      <div className='flex w-fit items-center gap-4 border border-white/10 bg-white/[0.02] px-5 py-3'>
        <div className='flex'>
          <p className='text-xs font-medium uppercase tracking-wider text-muted-foreground'>
            Total Customers
          </p>
          <p className='text-xl font-bold leading-tight text-white'>
            {customers.length}
          </p>
        </div>
      </div>
      <CustomersTable columns={customerColumns} data={customers} />
    </div>
  );
}
