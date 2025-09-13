'use client';

import { notFound } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
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
import type { Product, Review } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProductAndReviews = useCallback(async () => {
    setLoading(true);
    try {
      const productData = await getProductById(params.id);
      if (productData) {
        setProduct(productData);
        const reviewsData = await getReviewsByProductId(params.id);
        setReviews(reviewsData);
      } else {
        notFound();
      }
    } catch (error) {
      console.error("Failed to fetch product details:", error);
      notFound();
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProductAndReviews();
  }, [fetchProductAndReviews]);

  if (loading) {
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
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null; // notFound() is called inside useEffect
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="w-full relative">
          <ProductGallery imageIds={product.imageIds} imageHint={product.imageHint} />
          {product.onSale && (
            <Badge variant="destructive" className="absolute top-4 left-4 text-sm md:text-base z-10">Sale</Badge>
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
                    <p className="text-3xl md:text-4xl font-bold text-destructive">${product.salePrice.toFixed(2)}</p>
                    <p className="text-xl md:text-2xl font-semibold text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                </>
            ) : (
                <p className="text-2xl md:text-3xl font-semibold">${product.price.toFixed(2)}</p>
            )}
          </div>

          <p className="text-base sm:text-lg text-muted-foreground">{product.description}</p>
          
          <AddToCartButton product={product} />
        </div>
      </div>
      
      <Separator className="my-8 md:my-12" />

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
            <h2 className="font-headline text-2xl md:text-3xl font-bold">Reviews ({reviews.length})</h2>
            <AIReviewSummary reviews={reviews} />
            <div className="space-y-8">
            {reviews.length > 0 ? reviews.map(review => (
                <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                    <StarRating rating={review.rating} />
                    <p className="ml-4 font-bold text-sm sm:text-base">{review.author}</p>
                    <p className="ml-auto text-xs sm:text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">{review.text}</p>
                </div>
            )) : <p className="text-muted-foreground">Be the first to review this product!</p>}
            </div>
            <Separator className="my-8" />
            <AddReviewForm productId={product.id} onReviewAdded={fetchProductAndReviews} />
        </div>

        <div>
            <h2 className="font-headline text-2xl md:text-3xl font-bold mb-8">You Might Also Like</h2>
            <PersonalizedRecommendations currentProductId={product.id} />
        </div>
      </div>

    </div>
  );
}
