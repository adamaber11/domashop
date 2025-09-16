'use client';

import { notFound } from 'next/navigation';
import { StarRating } from '@/components/star-rating';
import { Separator } from '@/components/ui/separator';
import { AddToCartButton } from './_components/add-to-cart-button';
import AIReviewSummary from '@/components/ai-review-summary';
import PersonalizedRecommendations from '@/components/personalized-recommendations';
import { Badge } from '@/components/ui/badge';
import { AddReviewForm } from './_components/add-review-form';
import { ProductGallery } from './_components/product-gallery';
import { getProductById } from '@/lib/services/product-service';
import { getReviewsByProductId } from '@/lib/services/review-service';
import { useEffect, useState } from 'react';
import type { Product, Review } from '@/lib/types';
import { useCurrency } from '@/context/currency-context';
import { formatPrice } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCurrency } = useCurrency();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await getProductById(params.id);
        if (!productData) {
          notFound();
          return;
        }
        const reviewsData = await getReviewsByProductId(params.id);
        setProduct(productData);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Failed to fetch product data", error);
        notFound();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  if (loading || !product) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <div>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-4 mt-4">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="aspect-square w-full rounded-lg" />
              </div>
            </div>
            <div className="space-y-6">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-12 w-1/2" />
            </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="w-full relative">
          <ProductGallery imageUrls={product.imageUrls} imageHint={product.imageHint} />
          {product.onSale && (
            <Badge variant="destructive" className="absolute top-4 start-4 text-sm md:text-base z-10">Sale</Badge>
          )}
        </div>
        
        <div className="space-y-6">
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{product.name}</h1>
          
          <div className="flex items-center gap-2">
            <StarRating rating={product.averageRating} />
            <span className="text-sm text-muted-foreground">{product.averageRating.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-baseline gap-3">
            {product.onSale && typeof product.salePrice === 'number' ? (
                <>
                    <p className="text-3xl md:text-4xl font-bold text-destructive">{formatPrice(product.salePrice, selectedCurrency)}</p>
                    <p className="text-xl md:text-2xl font-semibold text-muted-foreground line-through">{formatPrice(product.price, selectedCurrency)}</p>
                </>
            ) : (
                <p className="text-2xl md:text-3xl font-semibold">{formatPrice(product.price, selectedCurrency)}</p>
            )}
          </div>

          <p className="text-base sm:text-lg text-muted-foreground">{product.description}</p>
          
          <AddToCartButton product={product} />
        </div>
      </div>
      
      <Separator className="my-8 md:my-12" />

      <div className="grid md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-8">
            <h2 className="font-headline text-2xl md:text-3xl font-bold">Reviews ({reviews.length})</h2>
            <AIReviewSummary reviews={reviews} />
            <div className="space-y-8">
            {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                    <StarRating rating={review.rating} />
                    <p className="ms-4 font-bold text-sm sm:text-base">{review.author}</p>
                    <p className="ms-auto text-xs sm:text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">{review.text}</p>
                </div>
            )) : <p className="text-muted-foreground">Be the first to review this product!</p>}
            </div>
            <Separator className="my-8" />
            <AddReviewForm productId={product.id} />
        </div>

        <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-8">You Might Also Like</h2>
            <PersonalizedRecommendations currentProductId={product.id} />
        </div>
      </div>

    </div>
  );
}
