'use client';

import Link from 'next/link';
import { ShoppingBag, Search, ShoppingCart, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CartSheetContent } from './cart-sheet';
import { useState } from 'react';
import { searchProducts } from '@/lib/services/product-service';
import type { Product } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MobileNav } from './mobile-nav';


export function Header() {
  const { itemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length > 1) {
      const results = await searchProducts(query, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const SearchContent = () => (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search for products..."
        className="w-full"
        aria-label="Search products"
        value={searchQuery}
        onChange={handleSearch}
        autoFocus
      />
      {searchQuery.length > 1 && searchResults.length > 0 && (
        <DropdownMenu open={true}>
          <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] mt-2" align="start">
            {searchResults.map((product) => {
              const placeholder = PlaceHolderImages.find(p => p.id === product.imageIds[0]);
              return (
                <DropdownMenuItem key={product.id} asChild onSelect={() => setSearchOpen(false)}>
                  <Link href={`/products/${product.id}`} className="flex items-center gap-4">
                    <div className="w-12 h-12 relative flex-shrink-0">
                        {placeholder && (
                          <Image
                            src={placeholder.imageUrl}
                            alt={product.name}
                            fill
                            className="rounded-md object-cover"
                          />
                        )}
                    </div>
                    <div className='flex-grow overflow-hidden'>
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="md:hidden flex items-center">
          <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs pr-0">
              <MobileNav onLinkClick={() => setMobileNavOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>

        <Link href="/" className="mx-auto md:mx-0 md:mr-4 flex items-center space-x-2 group transition-transform duration-300 hover:scale-105">
          <ShoppingCart className="h-8 w-8 text-primary" />
          <span className="font-extrabold font-headline sm:inline-block text-3xl">
            Do<span className="text-primary">m</span>a
          </span>
        </Link>

        <div className="flex-1 hidden md:flex justify-center md:px-4">
           {isMobile ? (
              <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogTrigger asChild>
                   <Button variant="ghost" size="icon" aria-label="Search">
                      <Search />
                    </Button>
                </DialogTrigger>
                <DialogContent className="top-1/4">
                  <SearchContent />
                </DialogContent>
              </Dialog>
           ) : (
             <div className="w-full max-w-md">
                <SearchContent />
             </div>
           )}
        </div>
        
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Search" className="md:hidden">
                  <Search className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="top-1/4">
              <SearchContent />
            </DialogContent>
          </Dialog>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col w-full sm:max-w-md">
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <CartSheetContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
