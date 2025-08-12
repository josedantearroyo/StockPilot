
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
    label: 'Inventario',
    icon: Boxes,
  },
  {
    href: '/employees',
    label: 'Empleados',
    icon: Users,
  },
  {
    href: '/assignments',
    label: 'Asignaciones',
    icon: ClipboardPlus,
  },
  {
    href: '/epp',
    label: 'Gestión EPP',
    icon: ShieldCheck,
  },
  {
    href: '/reports/discrepancy',
    label: 'Reporte de Discrepancias',
    icon: FileBarChart2,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader className="border-b border-sidebar-border/50">
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
                className="transition-colors duration-200 hover:bg-sidebar-accent/50"
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
      <SidebarFooter className="border-t border-sidebar-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:size-8 flex w-full justify-start gap-2 rounded-md p-2 text-left text-sm hover:bg-sidebar-accent/50 transition-colors duration-200"
            >
              <Avatar className="size-6">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback className="bg-primary/10 text-primary">CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
                <span className="font-medium">Admin</span>
                <span className="text-xs text-muted-foreground">admin@example.com</span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mb-2" side="right" align="end">
            <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="hover:bg-accent/50 transition-colors duration-150">
              <Link href="/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="hover:bg-accent/50 transition-colors duration-150">
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-destructive/10 hover:text-destructive transition-colors duration-150">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}

    