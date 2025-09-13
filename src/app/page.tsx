'use client';

import { useState } from 'react';
import { products } from '@/lib/data';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
          Welcome to Bazaar Bliss
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover a world of quality products, curated just for you. Your blissful shopping journey starts here.
        </p>
        <div className="mt-8 max-w-lg mx-auto flex gap-2">
          <Input
            type="search"
            placeholder="Search for products..."
            className="flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search products"
          />
          <Button type="submit" size="icon" aria-label="Search">
            <Search />
          </Button>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <h2 className="font-headline text-3xl font-bold text-center mb-10">
          Featured Products
        </h2>
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No products found matching your search.</p>
        )}
      </section>
    </div>
  );
}
