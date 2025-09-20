
'use server';
import { ProductCard } from '@/components/product-card';
import { getOnSaleProducts } from '@/lib/services/product-service';

export default async function SalePage() {
  // Re-using the getOnSaleProducts function for this page
  const products = await getOnSaleProducts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          Sale
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Huge savings await! Shop our sale section for the best deals.
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
          There are no items on sale at the moment. Please check back later!
        </p>
      )}
    </div>
  );
}
