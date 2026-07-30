// app/(dashboard)/dashboard/staff/customers/page.tsx
import { getCustomers } from '@/lib/queries/customers';
import { customerColumns } from '../../components/columns/customerColumns';
import { CustomersTable } from '../../components/CustomerTable';

export default async function CustomersPage() {
  const customers = await getCustomers();
  console.log('customers', customers);
  return (
    <div>
      <h1 className='text-2xl font-bold mb-1'>Customers</h1>
      <p className='text-sm text-muted-foreground mb-6'>
        Total customers: {customers.length}
      </p>
      <CustomersTable columns={customerColumns} data={customers} />
    </div>
  );
}
