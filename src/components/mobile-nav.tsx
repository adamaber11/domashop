'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
import { ScrollArea } from './ui/scroll-area';
import { useAuth } from '@/context/auth-context';
import { Skeleton } from './ui/skeleton';
import { useCart } from '@/context/cart-context';
import { useMemo, useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/services/settings-service';
import type { SiteSettings } from '@/lib/types';


const BoyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fillRule="evenodd">
      <path d="m180.34 205.89v-28.74c0-26.26-19.49-33.3-32.93-33.3-13.45 0-32.94 7.04-32.94 33.3v28.74h65.87z" fill="#a56a42"/>
      <path d="m115.34 167.06c-13.44 0-32.93-7.03-32.93-33.3v-28.74h65.86v28.74c0 26.27-19.49 33.3-32.93 33.3z" fill="#a56a42" transform="translate(32.13)"/>
      <path d="m128.51 166.75c-16.24 0-35.83-8.4-35.83-33.27v-28.74h71.64v28.74c0 24.87-19.59 33.27-35.81 33.27z" fill="#ffdba6"/>
      <path d="m128.51 123.6c-20.06 0-32.93 12.3-32.93 28.74v5.33h65.87v-5.33c0-16.44-12.87-28.74-32.94-28.74z" fill="#ffdba6"/>
      <path d="m128.51 166.75c-16.24 0-35.83-8.4-35.83-33.27v-28.74h71.64v28.74c0 24.87-19.59 33.27-35.81 33.27z" fill="#ffdba6"/>
      <path d="m128.51 123.6c-20.06 0-32.93 12.3-32.93 28.74v5.33h65.87v-5.33c0-16.44-12.87-28.74-32.94-28.74z" fill="#ffdba6"/>
      <path d="m150.81 106.94c-12.44 0-22.31-4.14-22.31-9.25 0-5.11 9.87-9.25 22.31-9.25s22.31 4.14 22.31 9.25c0 5.11-9.87 9.25-22.31 9.25z" fill="#d3976e"/>
      <path d="m106.21 106.94c-12.44 0-22.31-4.14-22.31-9.25 0-5.11 9.87-9.25 22.31-9.25s22.31 4.14 22.31 9.25c0 5.11-9.87 9.25-22.31 9.25z" fill="#d3976e"/>
      <path d="m128.51 123.6c-20.06 0-32.93-12.3-32.93-28.74v-11.8h65.87v11.8c0 16.44-12.87-28.74-32.94-28.74z" fill="#ffdba6"/>
      <path d="m128.51 113.88c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="#e8b983"/>
      <path d="m128.51 123.6c-20.06 0-32.93-12.3-32.93-28.74v-11.8h65.87v11.8c0 16.44-12.87-28.74-32.94-28.74z" fill="#ffdba6"/>
      <path d="m137.49 133.15c0 1.9-1.32 3.44-2.96 3.44h-12.04c-1.64 0-2.96-1.54-2.96-3.44 0-1.9 1.32-3.44 2.96-3.44h12.04c1.64 0 2.96 1.54 2.96 3.44z" fill="#fff"/>
      <path d="m154.51 123.4c-4.48 5.75-13.62 9.5-26 9.5-12.38 0-21.52-3.75-26-9.5h52z" fill="#f2aeae"/>
      <path d="m137.49 133.15c0 1.9-1.32 3.44-2.96 3.44h-12.04c-1.64 0-2.96-1.54-2.96-3.44 0-1.9 1.32-3.44 2.96-3.44h12.04c1.64 0 2.96 1.54 2.96 3.44z" fill="#fff"/>
      <g fill="#453e37">
        <path d="m142.34 116.14c0 .8-.53 1.44-1.18 1.44-.65 0-1.18-.64-1.18-1.44 0-.8.53-1.44 1.18-1.44.65 0 1.18.64 1.18 1.44z"/>
        <path d="m114.68 116.14c0 .8-.53 1.44-1.18 1.44-.65 0-1.18-.64-1.18-1.44 0-.8.53-1.44 1.18-1.44.65 0 1.18.64 1.18 1.44z"/>
      </g>
    </g>
  </svg>
);

const GirlIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" {...props}>
    <g fillRule="evenodd">
      <path d="m173.23 113.3c-15.93-1.07-28.7-14.07-28.7-30.29v-2.06c0-10.74-8.98-19.55-20-19.55s-20 8.81-20 19.55v2.06c0 16.22-12.77 29.22-28.7 30.29-19.04 1.28-21.6 22.9-21.6 37.13 0 13.56 1.7 24.52 2.3 28.57h134.4c.6-4.05 2.3-15.01 2.3-28.57 0-14.23-2.56-35.85-21.6-37.13z" fill="#ffdba6"/>
      <g fillRule="nonzero">
        <path d="m183.13 61.4c-32.96 0-32.96-29.33-32.96-29.33-32.96 0-32.96 29.33-32.96 29.33v34.92h-19.55c-10.74 0-19.55 8.81-19.55 19.55s8.81 19.55 19.55 19.55h105.02c-10.74 0-19.55-8.81-19.55-19.55s8.81-19.55 19.55-19.55h-19.55z" fill="#d3976e"/>
        <path d="m183.13 61.4c-32.96 0-32.96-29.33-32.96-29.33-32.96 0-32.96 29.33-32.96 29.33v34.92h-19.55c-10.74 0-19.55 8.81-19.55 19.55s8.81 19.55 19.55 19.55h105.02c10.74 0 19.55-8.81 19.55-19.55s-8.81-19.55-19.55-19.55h-19.55z" fill="#d3976e"/>
      </g>
      <path d="m173.23 113.3c-15.93-1.07-28.7-14.07-28.7-30.29v-2.06c0-10.74-8.98-19.55-20-19.55s-20 8.81-20 19.55v2.06c0 16.22-12.77 29.22-28.7 30.29-19.04 1.28-21.6 22.9-21.6 37.13 0 13.56 1.7 24.52 2.3 28.57h134.4c.6-4.05 2.3-15.01 2.3-28.57 0-14.23-2.56-35.85-21.6-37.13z" fill="#ffdba6"/>
      <path d="m177.33 213.14c0 16.28-14.54 21.6-32.93 21.6h-31.9c-18.39 0-32.93-5.32-32.93-21.6v-29.34h97.76z" fill="#f2aeae"/>
      <path d="m137.49 133.15c0 1.9-1.32 3.44-2.96 3.44h-12.04c-1.64 0-2.96-1.54-2.96-3.44 0-1.9 1.32-3.44 2.96-3.44h12.04c1.64 0 2.96 1.54 2.96 3.44z" fill="#fff"/>
      <path d="m154.51 123.4c-4.48 5.75-13.62 9.5-26 9.5s-21.52-3.75-26-9.5h52z" fill="#f2aeae"/>
      <path d="m128.51 113.88c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" fill="#e8b983"/>
      <g fill="#453e37">
        <path d="m142.34 116.14c0 .8-.53 1.44-1.18 1.44-.65 0-1.18-.64-1.18-1.44 0-.8.53-1.44 1.18-1.44.65 0 1.18.64 1.18 1.44z"/>
        <path d="m114.68 116.14c0 .8-.53 1.44-1.18 1.44-.65 0-1.18-.64-1.18-1.44 0-.8.53-1.44 1.18-1.44.65 0 1.18.64 1.18 1.44z"/>
      </g>
    </g>
  </svg>
);

interface MobileNavProps {
    onLinkClick?: () => void;
}
export function MobileNav({ onLinkClick }: MobileNavProps) {
  const pathname = usePathname();
  const { user, loading, signOut: firebaseSignOut } = useAuth();
  const { clearCart } = useCart();
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

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

  const userGender = user?.gender;
  const randomGender = useMemo(() => Math.random() < 0.5 ? 'male' : 'female', []);
  const displayGender = userGender === 'not-specified' ? randomGender : userGender;


  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Link href="/" onClick={onLinkClick} className="flex items-center space-x-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            <span className="font-extrabold font-headline text-3xl">
                {settings ? (
                  <>{settings.logoTextPart1}<span className="text-primary">{settings.logoTextPart2}</span>{settings.logoTextPart3}</>
                ) : (
                  <>Do<span className="text-primary">m</span>a</>
                )}
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
                      <div className="ps-8 divide-y">
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
                    <Link href="/admin/dashboard" onClick={() => { handleLinkClick('/admin/dashboard'); onLinkClick?.(); }} className={cn(navLinkClasses, pathname.startsWith('/admin') && activeLinkClasses)}>
                        <LayoutDashboard className="me-2 h-5 w-5" /> Dashboard
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
                  "h-14 w-14 cursor-pointer",
                  displayGender === 'male' && 'animate-male-glow',
                  displayGender === 'female' && 'animate-female-glow'
                )}>
                  <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User Avatar'} />
                  <AvatarFallback>
                    {displayGender === 'male' ? <BoyIcon className="w-12 h-12" /> : displayGender === 'female' ? <GirlIcon className="w-12 h-12" /> : user.email?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.displayName || user.firstName || 'Account'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </Link>
              <Button variant="outline" className="w-full" onClick={handleSignOut}>
                <LogOut className="me-2 h-4 w-4" /> Log Out
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button variant="outline" asChild className="w-full">
                <Link href="/login" onClick={onLinkClick}><LogIn className="me-2 h-4 w-4" />Log In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link href="/signup" onClick={onLinkClick}><UserPlus className="me-2 h-4 w-4" />Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
