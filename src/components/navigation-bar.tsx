// src/components/navigation-bar.tsx

'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { products } from '@/lib/data';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const categories = [...new Set(products.map(p => p.category))];

export function NavigationBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-background border-b sticky top-16 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <Link href="/" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/' ? 'text-primary' : 'text-foreground/60')}>
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium text-foreground/60 p-0 hover:bg-transparent hover:text-primary data-[state=open]:text-primary">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link href={`/category/${category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>{category}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/about' ? 'text-primary' : 'text-foreground/60')}>
              About
            </Link>
            <Link href="/contact" className={cn("text-sm font-medium transition-colors hover:text-primary", pathname === '/contact' ? 'text-primary' : 'text-foreground/60')}>
              Contact Us
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
