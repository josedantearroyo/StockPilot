
'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
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
} from 'lucide-react';

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
    </>
  );
}
