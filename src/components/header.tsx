'use client';

import Link from 'next/link';
import { ShoppingBag, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Input } from '@/components/ui/input';

export function Header() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2 group transition-transform duration-300 hover:scale-105 ml-5">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <span className="font-extrabold font-headline inline-block text-3xl">
            Do<span className="text-primary">m</span>a
          </span>
        </Link>

        <div className="flex-1 flex justify-center px-4">
          <div className="w-full max-w-md flex gap-2">
            <Input
              type="search"
              placeholder="Search for products..."
              className="flex-grow"
              aria-label="Search products"
            />
            <Button type="submit" variant="outline" size="icon" aria-label="Search">
              <Search />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
