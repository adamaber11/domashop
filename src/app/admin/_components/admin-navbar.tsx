'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Users, LineChart, SlidersHorizontal, ShoppingCart, FileText, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdminNavbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Products' },
    { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
    { href: '/admin/pages', icon: FileText, label: 'Pages' },
    { href: '/admin/settings', icon: SlidersHorizontal, label: 'Settings' },
  ];

  const navLinkClasses = "transition-colors relative after:content-[''] after:absolute after:-bottom-1.5 after:start-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300 whitespace-nowrap";
  const inactiveClasses = "text-muted-foreground hover:text-primary hover:after:scale-x-100";
  const activeClasses = "text-primary after:scale-x-100";

  return (
    <div className="bg-muted/40 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-14 items-center">
                <div className="overflow-x-auto">
                    <nav className="flex items-center gap-6">
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
                    </nav>
                </div>
            </div>
        </div>
    </div>
  );
}
