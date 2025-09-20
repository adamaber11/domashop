
'use server';
import { ProductCard } from '@/components/product-card';
import { getAllProducts } from '@/lib/services/product-service';

export default async function NewArrivalsPage() {
  // For now, we'll just show the latest products overall.
  // In a real app, this might be based on creation date.
  const products = (await getAllProducts()).slice(0, 8);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          New Arrivals (المنتجات الجديدة)
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Check out the latest additions to our collection. Fresh finds, just for you.
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground text-lg">
          No new arrivals at the moment. Please check back soon!
        </p>
      )}
    </div>
  );
}
