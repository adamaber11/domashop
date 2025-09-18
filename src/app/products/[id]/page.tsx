'use server';

import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/services/product-service';
import { Separator } from '@/components/ui/separator';
import PersonalizedRecommendations from '@/components/personalized-recommendations';
import { ProductDetails } from './_components/product-details';
import { ProductReviews } from './_components/product-reviews';

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <ProductDetails product={product} />
      
      <Separator className="my-8 md:my-12" />

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
           <ProductReviews productId={product.id} />
        </div>

        <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-8">You Might Also Like</h2>
            <PersonalizedRecommendations currentProductId={product.id} />
        </div>
      </div>
    </div>
  );
}
