
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogIn, UserPlus, LogOut, User as UserIcon, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { categories } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';
import { useCart } from '@/context/cart-context';
import { CurrencySelector } from './currency-selector';
import { generateColorFromString } from '@/lib/utils';


export function NavigationBar() {
  const pathname = usePathname();
  const { user, loading, signOut: firebaseSignOut } = useAuth();
  const { clearCart } = useCart();

  const navLinkClasses = "text-base transition-colors relative after:content-[''] after:absolute after:bottom-0 after:start-1/2 after:-translate-x-1/2 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300";
  const activeClasses = "text-primary after:scale-x-100";
  const inactiveClasses = "text-foreground/80 hover:text-primary hover:after:scale-x-100";

  const handleSignOut = async () => {
    await firebaseSignOut();
    clearCart();
  };

  return (
    <nav className="bg-background border-b sticky top-20 z-40 hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className={cn(navLinkClasses, pathname === '/' ? activeClasses : inactiveClasses)}>
              Home
            </Link>

            <Link href="/offers" className={cn(navLinkClasses, pathname === '/offers' ? activeClasses : inactiveClasses)}>
              Offers
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div tabIndex={0} role="button" aria-haspopup="true" aria-expanded="false" className={cn(
                  navLinkClasses,
                  'flex items-center gap-1 focus:outline-none cursor-pointer',
                   pathname.startsWith('/category') ? activeClasses : inactiveClasses
                )}>
                  Categories
                  <ChevronDown className="h-4 w-4" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
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

            <Link href="/about" className={cn(navLinkClasses, pathname === '/about' ? activeClasses : inactiveClasses)}>
              About
            </Link>
            <Link href="/contact" className={cn(navLinkClasses, pathname === '/contact' ? activeClasses : inactiveClasses)}>
              Contact Us
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
             <CurrencySelector />

            {loading ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 cursor-pointer transition-transform hover:scale-110">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User Avatar'} />
                      <AvatarFallback style={{ backgroundColor: generateColorFromString(user.uid) }}>
                        {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.email === 'adamaber50@gmail.com' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard"><LayoutDashboard className="me-2 h-4 w-4" /> Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account"><UserIcon className="me-2 h-4 w-4" /> My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="me-2 h-4 w-4" /> Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login"><LogIn className="me-2 h-4 w-4" />Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup"><UserPlus className="me-2 h-4 w-4" />Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
