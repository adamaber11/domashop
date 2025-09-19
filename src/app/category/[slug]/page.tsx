
'use server';
import { ProductCard } from '@/components/product-card';
import { notFound } from 'next/navigation';
import { getProductsByCategory } from '@/lib/services/product-service';
import { getCategoryBySlug } from '@/lib/services/category-service';

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await getCategoryBySlug(params.slug);
  
  if (!category) {
    notFound();
  }

  // Fetch products that are in this category OR any of its subcategories
  const categoryNames = [category.name, ...category.subcategories.map(s => s.name)];
  const products = await getProductsByCategory(categoryNames);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight">
          {category.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of products in the {category.name} category.
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
          There are no products in this category yet.
        </p>
      )}
    </div>
  );
}
