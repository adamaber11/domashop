import { products, categories } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'),
  }));
}

function getCategoryNameFromSlug(slug: string) {
    const category = categories.find(c => c.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === slug);
    return category || null;
}


export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categoryName = getCategoryNameFromSlug(params.slug);
  
  if (!categoryName) {
    notFound();
  }
  
  const categoryProducts = products.filter(
    (product) => product.category === categoryName
  );

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

      {categoryProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryProducts.map((product) => (
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
