'use client';

import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';

import type { User } from '@supabase/supabase-js';

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  LayoutDashboard,
  Gamepad2,
  CalendarDays,
  Plus,
  Monitor,
  User2,
  Users,
  GamepadDirectional,
  IndianRupee,
  Settings2,
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  type LucideIcon,
} from 'lucide-react';
import { ModeToggle } from './ModeToggle';
import { handleSignOut } from '@/lib/auth/oauth';
import { cn } from '@/lib/utils';

type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export function NavManagement({ items }: NavMainProps) {
  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Management</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <a href={item.url} aria-label={item.title}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* User info */}
        <div
          className={cn(
            'flex items-center gap-2 px-2 py-2',
            'group-data-[collapsible=icon]:justify-center',
          )}
        >
          <Avatar className='h-8 w-8 shrink-0 rounded-lg'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
          </Avatar>

          <div className='grid min-w-0 flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden'>
            <span className='truncate font-semibold'>{user.name}</span>
            <span className='truncate text-xs'>{user.email}</span>
          </div>
        </div>

        {/* Divider */}
        <div className='mx-2 border-t border-sidebar-border' />

        {/* Logout */}
        <SidebarMenuButton
          type='button'
          onClick={handleSignOut}
          className='mt-1'
          tooltip='Log out'
        >
          <LogOut />
          <span>Log out</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
    // <SidebarMenu>
    //   <SidebarMenuItem>
    //     <DropdownMenu>
    //       <DropdownMenuTrigger asChild>
    //         <SidebarMenuButton
    //           size='lg'
    //           className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
    //         >
    //           <Avatar className='h-8 w-8 rounded-lg'>
    //             <AvatarImage src={user.avatar} alt={user.name} />
    //             <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
    //           </Avatar>
    //           <div className='grid flex-1 text-left text-sm leading-tight'>
    //             <span className='truncate font-semibold'>{user.name}</span>
    //             <span className='truncate text-xs'>{user.email}</span>
    //           </div>
    //           <ChevronsUpDown className='ml-auto size-4' />
    //         </SidebarMenuButton>
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent
    //         className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
    //         side={isMobile ? 'bottom' : 'right'}
    //         align='end'
    //         sideOffset={4}
    //       >
    //         <DropdownMenuLabel className='p-0 font-normal'>
    //           <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
    //             <Avatar className='h-8 w-8 rounded-lg'>
    //               <AvatarImage src={user.avatar} alt={user.name} />
    //               <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
    //             </Avatar>
    //             <div className='grid flex-1 text-left text-sm leading-tight'>
    //               <span className='truncate font-semibold'>{user.name}</span>
    //               <span className='truncate text-xs'>{user.email}</span>
    //             </div>
    //           </div>
    //         </DropdownMenuLabel>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuGroup>
    //           <DropdownMenuItem>
    //             <BadgeCheck />
    //             Profile
    //           </DropdownMenuItem>

    //           <DropdownMenuItem>
    //             <Settings2 />
    //             Settings
    //           </DropdownMenuItem>
    //         </DropdownMenuGroup>
    //         <DropdownMenuSeparator />
    //         <DropdownMenuItem>
    //           <LogOut />
    //           Log out
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   </SidebarMenuItem>
    // </SidebarMenu>
  );
}

type NavMainProps = {
  items: NavItem[];
};

export function NavMain({ items }: NavMainProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Overview</SidebarGroupLabel>

      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild tooltip={item.title}>
              <a href={item.url} aria-label={item.title}>
                <item.icon />
                <span>{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: 'staff' | 'owner';
  user: User;
};

export function AppSidebar({ role, user, ...props }: AppSidebarProps) {
  const navMain = [
    {
      title: 'Dashboard',
      url: '/dashboard/staff',
      icon: LayoutDashboard,
    },
    {
      title: 'Live Sessions',
      url: '/dashboard/staff/live-sessions',
      icon: Gamepad2,
    },
    {
      title: 'Bookings',
      url: '/dashboard/staff/bookings',
      icon: CalendarDays,
    },
    {
      title: 'Add booking',
      url: '/dashboard/staff/bookings/new',
      icon: Plus,
    },
  ];

  const management: NavItem[] = [
    {
      title: 'Profile settings',
      url: '/dashboard/staff/stations',
      icon: User2,
    },
  ];

  if (role === 'owner') {
    management.push(
      {
        title: 'Stations',
        url: '/dashboard/staff/stations',
        icon: Monitor,
      },
      {
        title: 'Customers',
        url: '/dashboard/staff/customers',
        icon: Users,
      },
      {
        title: 'Games',
        url: '/dashboard/staff/games',
        icon: GamepadDirectional,
      },
      {
        title: 'Cafe settings',
        url: '/dashboard/staff/cafe-settings',
        icon: Settings2,
      },
    );
  }
  const sidebarUser = {
    name: user.user_metadata.full_name ?? 'Staff',
    email: user.email ?? '',
    avatar: user.user_metadata.avatar_url ?? '',
  };
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='flex items-center justify-between group-data-[collapsible=icon]:justify-center'>
          <SidebarTrigger />

          <div className='group-data-[collapsible=icon]:hidden'>
            <ModeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavManagement items={management} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
