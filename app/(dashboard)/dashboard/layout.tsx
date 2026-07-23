// src/app/dashboard/layout.tsx
import { requireRole } from '@/lib/auth/requrireRole';
import React from 'react';
import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from './components/AppSidebar';
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, role } = await requireRole(['staff', 'owner']);
  return (
    // <SidebarProvider>
    //   <AppSidebar role={role} user={user} />
    //   <main className='flex flex-col gap-6 p-6'>{children}</main>
    // </SidebarProvider>
    <SidebarProvider>
      <AppSidebar role={role} user={user} />

      <SidebarInset>
        <header className='flex h-14 items-center border-b px-4'>
          <SidebarTrigger />
        </header>

        <main className='p-6'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
