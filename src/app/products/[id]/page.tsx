import { products } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StarRating } from '@/components/star-rating';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { AddToCartButton } from './_components/add-to-cart-button';
import AIReviewSummary from '@/components/ai-review-summary';
import PersonalizedRecommendations from '@/components/personalized-recommendations';

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const placeholder = PlaceHolderImages.find(p => p.id === product.imageId);
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div className="w-full">
          {placeholder && (
            <Image
              src={placeholder.imageUrl}
              alt={product.description}
              width={800}
              height={600}
              className="w-full h-auto object-cover rounded-lg shadow-lg"
              data-ai-hint={product.imageHint}
              priority
            />
          )}
        </div>
        
        <div className="space-y-6">
          <h1 className="font-headline text-4xl lg:text-5xl font-bold tracking-tight">{product.name}</h1>
          
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} />
            <span className="text-muted-foreground">{averageRating.toFixed(1)} ({product.reviews.length} reviews)</span>
          </div>

          <p className="text-3xl font-semibold">${product.price.toFixed(2)}</p>

          <p className="text-lg text-muted-foreground">{product.description}</p>
          
          <AddToCartButton product={product} />
        </div>
      </div>
      
      <Separator className="my-12" />

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <h2 className="font-headline text-3xl font-bold">Reviews</h2>
            <AIReviewSummary reviews={product.reviews} />
            <div className="space-y-8">
            {product.reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                    <StarRating rating={review.rating} />
                    <p className="ml-4 font-bold">{review.author}</p>
                    <p className="ml-auto text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <p className="text-muted-foreground">{review.text}</p>
                </div>
            ))}
            </div>
        </div>

        <div>
            <h2 className="font-headline text-3xl font-bold mb-8">You Might Also Like</h2>
            <PersonalizedRecommendations currentProductId={product.id} />
        </div>
      </div>

    </div>
  );
}
