

'use server';
import { ProductCard } from '@/components/product-card';
import { getOnSaleProducts } from '@/lib/services/product-service';

export default async function OffersPage() {
  const products = await getOnSaleProducts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          العروض
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Don't miss out! Explore our exclusive deals and save on your favorite products.
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
          There are no special offers available at the moment. Please check back later!
        </p>
      )}
    </div>
  );
}
