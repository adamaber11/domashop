'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Home, Package, Users, LineChart } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user || user.email !== 'adamaber50@gmail.com') {
        router.replace('/');
      }
    }
  }, [user, loading, router]);

  const navItems = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
  ];

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-4xl p-8 space-y-8">
            <Skeleton className="h-16 w-1/4" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Skeleton className="h-96" />
                <Skeleton className="h-96" />
            </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
          <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                <SidebarTrigger />
                <h2 className="font-bold text-lg group-data-[collapsible=icon]:hidden">Admin Panel</h2>
              </div>
          </SidebarHeader>
          <SidebarContent>
              <SidebarMenu>
                  {navItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <Link href={item.href}>
                          <SidebarMenuButton 
                              isActive={pathname.startsWith(item.href)}
                              tooltip={item.label}
                          >
                              <item.icon />
                              <span>{item.label}</span>
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                  ))}
              </SidebarMenu>
          </SidebarContent>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
