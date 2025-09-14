'use client';

import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, UserPlus, ShoppingCart, LogOut, LayoutDashboard } from 'lucide-react';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';
import { useCart } from '@/context/cart-context';

interface MobileNavProps {
  onLinkClick?: () => void;
}

const BoyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const GirlIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);


export function MobileNav({ onLinkClick }: MobileNavProps) {
  const pathname = usePathname();
  const { user, loading, signOut: firebaseSignOut } = useAuth();
  const { clearCart } = useCart();

  const handleLinkClick = (href: string) => {
    if (pathname === href) {
        onLinkClick?.();
    }
  };

  const handleSignOut = async () => {
    await firebaseSignOut();
    clearCart();
    onLinkClick?.();
  };

  const navLinkClasses = "flex items-center w-full p-4 text-lg font-semibold";
  const activeLinkClasses = "bg-accent text-accent-foreground";

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" onClick={onLinkClick} className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <span className="font-extrabold font-headline text-3xl">
                Do<span className="text-primary">m</span>a
            </span>
        </Link>
      </div>

      <div className="flex-grow flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow">
            <nav className="divide-y">
                <Link href="/" onClick={() => { handleLinkClick('/'); onLinkClick?.(); }} className={cn(navLinkClasses, pathname === '/' && activeLinkClasses)}>
                  Home
                </Link>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="categories" className="border-b-0">
                    <AccordionTrigger className={cn(navLinkClasses, "py-0 hover:no-underline", pathname.startsWith('/category') && activeLinkClasses)}>
                      Categories
                    </AccordionTrigger>
                    <AccordionContent className="bg-muted/50">
                      <div className="pl-8 divide-y">
                        {categories.map((category) => {
                          const categorySlug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
                          const href = category === 'All' ? '/category' : `/category/${categorySlug}`;
                          return (
                            <Link key={category} href={href} onClick={() => { handleLinkClick(href); onLinkClick?.(); }} className={cn("block py-3 text-base", pathname === href && "font-bold text-primary")}>
                              {category}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Link href="/about" onClick={() => { handleLinkClick('/about'); onLinkClick?.(); }} className={cn(navLinkClasses, pathname === '/about' && activeLinkClasses)}>
                  About
                </Link>
                
                <Link href="/contact" onClick={() => { handleLinkClick('/contact'); onLinkClick?.(); }} className={cn(navLinkClasses, pathname === '/contact' && activeLinkClasses)}>
                  Contact Us
                </Link>

                {user && user.email === 'adamaber50@gmail.com' && (
                    <Link href="/admin/dashboard" onClick={() => { handleLinkClick('/admin/dashboard'); onLinkClick?.(); }} className={cn(navLinkClasses, pathname === '/admin/dashboard' && activeLinkClasses)}>
                        <LayoutDashboard className="mr-2 h-5 w-5" /> Dashboard
                    </Link>
                )}
            </nav>
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          {loading ? (
             <div className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
          ) : user ? (
            <div className='space-y-3'>
              <Link href="/account" onClick={onLinkClick} className="flex items-center space-x-3">
                <Avatar className={cn(
                  "h-12 w-12 cursor-pointer",
                  user.gender === 'male' && 'animate-male-glow',
                  user.gender === 'female' && 'animate-female-glow'
                )}>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
                  <AvatarFallback>
                    {user.gender === 'male' ? <BoyIcon className="w-8 h-8" /> : user.gender === 'female' ? <GirlIcon className="w-8 h-8" /> : user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.displayName || user.firstName || 'Account'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </Link>
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Log Out
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={onLinkClick}><LogIn className="mr-2 h-4 w-4" />Log In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/signup" onClick={onLinkClick}><UserPlus className="mr-2 h-4 w-4" />Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
