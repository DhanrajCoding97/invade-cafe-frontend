import { requireRole } from '@/lib/auth/requrireRole';
import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '../components/AppSidebar';
import { ModeToggle } from '../components/ModeToggle';
export default async function StaffDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await requireRole(['staff', 'owner']);
  return (
    <SidebarProvider>
      <AppSidebar role={role} user={user} />

      <SidebarInset className='h-dvh overflow-hidden'>
        <header className='flex h-14 shrink-0 items-center border-b px-4'>
          <SidebarTrigger />
          <ModeToggle />
        </header>

        <main className='p-8 flex-1 overflow-y-auto overscroll-contain'>
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
