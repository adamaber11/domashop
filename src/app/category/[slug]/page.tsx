
'use server';
import { ProductCard } from '@/components/product-card';
import { notFound } from 'next/navigation';
import { getProductsByCategoryName } from '@/lib/services/product-service';
import { categoriesHierarchy } from '@/lib/data';

function findCategoryBySlug(slug: string) {
    for (const mainCategory of categoriesHierarchy) {
        if (mainCategory.slug === slug) {
            return {
                ...mainCategory,
                // Include subcategory names for product fetching
                allCategoryNames: [mainCategory.name, ...mainCategory.subcategories.map(s => s.name)]
            };
        }
        for (const subCategory of mainCategory.subcategories) {
            if (subCategory.slug === slug) {
                return {
                    ...subCategory,
                    allCategoryNames: [subCategory.name] // Only fetch for this specific subcategory
                };
            }
        }
    }
    return null;
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = findCategoryBySlug(params.slug);
  
  if (!category) {
    notFound();
  }

  const products = await getProductsByCategoryName(category.allCategoryNames);

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
