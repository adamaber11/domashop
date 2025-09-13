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
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function NavigationBar() {
  const pathname = usePathname();
  // Mock authentication state. In a real app, this would come from a context or auth provider.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navLinkClasses = "text-sm font-medium transition-colors hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100";

  return (
    <nav className="bg-background border-b sticky top-16 z-40 hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <Link href="/" className={cn(navLinkClasses, pathname === '/' ? 'text-primary after:scale-x-100' : 'text-foreground/80')}>
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(navLinkClasses, 'p-0 data-[state=open]:text-primary data-[state=open]:after:scale-x-100', pathname.startsWith('/category') ? 'text-primary after:scale-x-100' : 'text-foreground/80' )}>
                  Categories
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map((category) => {
                  const categorySlug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                  return (
                    <DropdownMenuItem key={category} asChild>
                      <Link href={category === 'All' ? '/category' : `/category/${categorySlug}`}>{category}</Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/about" className={cn(navLinkClasses, pathname === '/about' ? 'text-primary after:scale-x-100' : 'text-foreground/80')}>
              About
            </Link>
            <Link href="/contact" className={cn(navLinkClasses, pathname === '/contact' ? 'text-primary after:scale-x-100' : 'text-foreground/80')}>
              Contact Us
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <Link href="/account">
                <Avatar className="h-9 w-9 cursor-pointer transition-transform hover:scale-110">
                  <AvatarImage src="https://picsum.photos/seed/user1/200" alt="User Avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login"><LogIn className="mr-2 h-4 w-4" />Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup"><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
