'use client';
import { products as allProducts, categories } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/lib/services/product-service';
import { useEffect, useState } from 'react';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function getCategoryNameFromSlug(slug: string) {
    const category = categories.find(c => c.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === slug);
    return category || null;
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = getCategoryNameFromSlug(params.slug);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (categoryName) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const categoryProducts = await getProductsByCategory(categoryName);
          setProducts(categoryProducts);
        } catch (error) {
          console.error(`Failed to fetch products for category ${categoryName}:`, error);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [categoryName]);

  if (!categoryName) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          {categoryName}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of products in the {categoryName} category.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(8)].map((_, i) => (
             <div key={i} className="space-y-3">
                <Skeleton className="h-64" />
                <Skeleton className="h-5 w-5/6" />
                <Skeleton className="h-5 w-3/4" />
              </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">
          There are no products in this category yet.
        </p>
      )}
    </div>
  );
}
