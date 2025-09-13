'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogIn, UserPlus, ShoppingCart } from 'lucide-react';
import { categories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { ScrollArea } from './ui/scroll-area';

interface MobileNavProps {
  onLinkClick?: () => void;
}

export function MobileNav({ onLinkClick }: MobileNavProps) {
  const pathname = usePathname();
  // Mock authentication state. In a real app, this would come from a context or auth provider.
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLinkClick = (href: string) => {
    if (pathname === href) {
        onLinkClick?.();
    }
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
                <Link href="/" onClick={() => handleLinkClick('/')} className={cn(navLinkClasses, pathname === '/' && activeLinkClasses)}>
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
                            <Link key={category} href={href} onClick={() => handleLinkClick(href)} className={cn("block py-3 text-base", pathname === href && "font-bold text-primary")}>
                              {category}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <Link href="/about" onClick={() => handleLinkClick('/about')} className={cn(navLinkClasses, pathname === '/about' && activeLinkClasses)}>
                  About
                </Link>
                
                <Link href="/contact" onClick={() => handleLinkClick('/contact')} className={cn(navLinkClasses, pathname === '/contact' && activeLinkClasses)}>
                  Contact Us
                </Link>
            </nav>
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          {isLoggedIn ? (
            <Link href="/account" onClick={onLinkClick} className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 cursor-pointer">
                <AvatarImage src="https://picsum.photos/seed/user1/200" alt="User Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-muted-foreground">View Account</p>
              </div>
            </Link>
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
