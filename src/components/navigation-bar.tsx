// src/components/navigation-bar.tsx

'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogIn, UserPlus, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';
import { useCart } from '@/context/cart-context';

export function NavigationBar() {
  const pathname = usePathname();
  const { user, loading, signOut: firebaseSignOut } = useAuth();
  const { clearCart } = useCart();

  const navLinkClasses = "text-sm font-medium transition-colors hover:text-primary relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-right after:transition-transform after:duration-300 hover:after:scale-x-100";

  const handleSignOut = async () => {
    await firebaseSignOut();
    clearCart();
  };

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
            {loading ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className={cn(
                        "h-9 w-9 cursor-pointer transition-transform hover:scale-110",
                        user.gender === 'male' && 'animate-male-glow',
                        user.gender === 'female' && 'animate-female-glow'
                    )}>
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User Avatar'} />
                      <AvatarFallback>{user.email?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.email === 'adamaber50@gmail.com' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account"><UserIcon className="mr-2 h-4 w-4" /> My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
