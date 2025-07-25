
'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from './logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Boxes,
  FileBarChart2,
  LayoutDashboard,
  Users,
  ClipboardPlus,
  ShieldCheck,
  Settings,
  LogOut,
  User as UserIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';

const links = [
  {
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/inventory',
    label: 'Inventory',
    icon: Boxes,
  },
  {
    href: '/employees',
    label: 'Employees',
    icon: Users,
  },
  {
    href: '/assignments',
    label: 'Assignments',
    icon: ClipboardPlus,
  },
  {
    href: '/epp',
    label: 'EPP Management',
    icon: ShieldCheck,
  },
  {
    href: '/reports/discrepancy',
    label: 'Discrepancy Report',
    icon: FileBarChart2,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/')}
                tooltip={link.label}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8 flex w-full justify-start gap-2 rounded-md p-2 text-left text-sm"
            >
              <Avatar className="size-6">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                <span className="font-medium">Admin</span>
                <span className="text-xs text-muted-foreground">admin@example.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mb-2" side="right" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
