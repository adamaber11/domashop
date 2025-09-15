// src/components/navigation-bar.tsx

'use client';

import {Link, usePathname} from '@/navigation';
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
import { useMemo } from 'react';
import {useTranslations, useLocale} from 'next-intl';

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


export function NavigationBar() {
  const t = useTranslations('NavigationBar');
  const pathname = usePathname();
  const { user, loading, signOut: firebaseSignOut } = useAuth();
  const { clearCart } = useCart();
  const locale = useLocale();

  const isArabic = locale === 'ar';

  const baseLinkClasses = "text-base transition-colors relative";
  const underlineClasses = "after:content-[''] after:absolute after:bottom-0 after:start-1/2 after:-translate-x-1/2 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 after:origin-center after:transition-transform after:duration-300";
  
  const hoverClasses = isArabic 
    ? "hover:text-primary" 
    : "hover:text-primary hover:after:scale-x-100";
  
  const activeClasses = isArabic 
    ? "text-primary" 
    : "text-primary after:scale-x-100";

  const inactiveClasses = "text-foreground/80";

  const handleSignOut = async () => {
    await firebaseSignOut();
    clearCart();
  };

  const userGender = user?.gender;
  const randomGender = useMemo(() => Math.random() < 0.5 ? 'male' : 'female', []);
  const displayGender = userGender === 'not-specified' ? randomGender : userGender;

  return (
    <nav className="bg-background border-b sticky top-16 z-40 hidden md:block">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8">
            <Link href="/" className={cn(baseLinkClasses, !isArabic && underlineClasses, hoverClasses, pathname === '/' ? activeClasses : inactiveClasses)}>
              {t('home')}
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={cn(baseLinkClasses, 'p-0 data-[state=open]:text-primary', !isArabic && underlineClasses, hoverClasses, pathname.startsWith('/category') ? activeClasses : inactiveClasses)}>
                  {t('categories')}
                  <ChevronDown className="ms-1 h-4 w-4" />
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

            <Link href="/about" className={cn(baseLinkClasses, !isArabic && underlineClasses, hoverClasses, pathname === '/about' ? activeClasses : inactiveClasses)}>
              {t('about')}
            </Link>
            <Link href="/contact" className={cn(baseLinkClasses, !isArabic && underlineClasses, hoverClasses, pathname === '/contact' ? activeClasses : inactiveClasses)}>
              {t('contact')}
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            {loading ? (
              <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className={cn(
                        "h-10 w-10 cursor-pointer transition-transform hover:scale-110",
                        displayGender === 'male' && 'animate-male-glow',
                        displayGender === 'female' && 'animate-female-glow'
                    )}>
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User Avatar'} />
                      <AvatarFallback>
                        {displayGender === 'male' ? <BoyIcon className="w-9 h-9" /> : displayGender === 'female' ? <GirlIcon className="w-9 h-9" /> : user.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.email === 'adamaber50@gmail.com' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard"><LayoutDashboard className="me-2 h-4 w-4" /> {t('dashboard')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/account"><UserIcon className="me-2 h-4 w-4" /> {t('myAccount')}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="me-2 h-4 w-4" /> {t('logOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login"><LogIn className="me-2 h-4 w-4" />{t('logIn')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup"><UserPlus className="me-2 h-4 w-4" />{t('signUp')}</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
