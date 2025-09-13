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
import { ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';

export function NavigationBar() {
  const pathname = usePathname();

  const navLinkClasses = "text-sm font-bold transition-colors hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <nav className="bg-background border-b sticky top-16 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <Link href="/" className={cn(navLinkClasses, pathname === '/' ? 'text-primary after:scale-x-100' : 'text-foreground/60')}>
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-bold text-foreground/60 p-0 hover:bg-transparent hover:text-primary data-[state=open]:text-primary">
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link href={`/category/${category === 'All' ? '' : category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}>{category}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className={cn(navLinkClasses, pathname === '/about' ? 'text-primary after:scale-x-100' : 'text-foreground/60')}>
              About
            </Link>
            <Link href="/contact" className={cn(navLinkClasses, pathname === '/contact' ? 'text-primary after:scale-x-100' : 'text-foreground/60')}>
              Contact Us
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
