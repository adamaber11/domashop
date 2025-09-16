'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Users, LineChart, SlidersHorizontal, ShoppingCart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

export function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/admin/settings', icon: SlidersHorizontal, label: 'Settings' },
    { href: '/admin/pages', icon: FileText, label: 'Pages' },
  ];

  const navLinkClasses = "transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:start-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300";
  const inactiveClasses = "text-muted-foreground hover:text-primary hover:after:scale-x-100";
  const activeClasses = "text-primary after:scale-x-100";

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center gap-8">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        'flex items-center gap-2 text-sm font-medium',
                        navLinkClasses,
                        pathname.startsWith(item.href) ? activeClasses : inactiveClasses
                    )}
                >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                </Link>
            ))}
            </div>
        </div>
        <Separator />
    </div>
  );
}
