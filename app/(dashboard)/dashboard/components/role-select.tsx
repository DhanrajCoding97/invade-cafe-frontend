// role-select.tsx
'use client';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useUpdateUserRole } from '@/hooks/use-customer-mutation';
import { type CustomerRow } from '@/types';
import { toast } from 'sonner';
import Badge from '@/app/components/neonblade-ui/badge';
import { type UserRole } from '@/types';

export function RoleSelect({ customer }: { customer: CustomerRow }) {
  const updateRole = useUpdateUserRole();

  const [open, setOpen] = useState(false);

  const [selectedRole, setSelectedRole] = useState<UserRole>(customer.role);

  const handleConfirm = async () => {
    const promise = updateRole.mutateAsync({
      userId: customer.id,
      role: selectedRole as 'owner' | 'staff' | 'customer',
    });

    toast.promise(promise, {
      loading: 'Updating role…',
      success: 'Role updated',
      error: (err) =>
        err instanceof Error ? err.message : 'Failed to update role',
    });

    try {
      await promise;
      setOpen(false);
    } catch {
      // keep dialog open if you want, or close it
    }
  };

  if (customer.role === 'owner') {
    return (
      <Badge
        color='cyan'
        variant='outline'
        className='justify-center'
        size='sm'
      >
        Owner
      </Badge>
    );
  }

  return (
    <>
      <Select
        value={customer.role}
        onValueChange={(role) => {
          setSelectedRole(role as UserRole);
          setOpen(true);
        }}
        disabled={updateRole.isPending}
      >
        <SelectTrigger className='min-w-32'>
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='customer'>Customer</SelectItem>
          <SelectItem value='staff'>Staff</SelectItem>
        </SelectContent>
      </Select>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size='sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Change user role?</AlertDialogTitle>

            <AlertDialogDescription>
              Change <strong>{customer.full_name ?? 'this user'}</strong>'s role
              from <strong>{customer.role}</strong> to{' '}
              <strong>{selectedRole}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedRole(customer.role)}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={updateRole.isPending}
              onClick={handleConfirm}
            >
              Change Role
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
    // <Select
    //   value={customer.role}
    //   onValueChange={(role) => {
    //     if (
    //       confirm(
    //         `Change ${customer.full_name ?? 'this user'}'s role to ${role}?`,
    //       )
    //     ) {
    //       const promise = updateRole.mutateAsync({
    //         userId: customer.id,
    //         role: role as 'owner' | 'staff' | 'customer',
    //       });
    //       toast.promise(promise, {
    //         loading: 'Updating role…',
    //         success: 'Role updated',
    //         error: (err) =>
    //           err instanceof Error ? err.message : 'Failed to update role',
    //       });
    //     }
    //   }}
    //   disabled={updateRole.isPending}
    // >
    //   <SelectTrigger className='w-[110px]'>
    //     <SelectValue />
    //   </SelectTrigger>
    //   <SelectContent>
    //     <SelectItem value='customer'>Customer</SelectItem>
    //     <SelectItem value='staff'>Staff</SelectItem>
    //   </SelectContent>
    // </Select>
  );
}
