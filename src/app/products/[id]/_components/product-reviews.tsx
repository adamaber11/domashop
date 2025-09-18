'use client';

import { StarRating } from '@/components/star-rating';
import { Separator } from '@/components/ui/separator';
import { AddReviewForm } from './add-review-form';
import type { Review } from '@/lib/types';
import AIReviewSummary from '@/components/ai-review-summary';
import { useState, useEffect } from 'react';
import { getReviewsByProductId } from '@/lib/services/review-service';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const reviewsData = await getReviewsByProductId(productId);
        setReviews(reviewsData);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setError("Could not load reviews at this time.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);
  
  const handleReviewAdded = (newReview: Review) => {
    setReviews(prevReviews => [newReview, ...prevReviews]);
  };

  return (
    <div className="space-y-8">
      <h2 className="font-headline text-2xl md:text-3xl font-bold">Reviews ({loading ? '...' : reviews.length})</h2>
      
      <AIReviewSummary reviews={reviews} />
      
      <div className="space-y-8">
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        )}
        {error && <p className="text-destructive">{error}</p>}
        {!loading && !error && (
          reviews.length > 0 ? reviews.map(review => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <StarRating rating={review.rating} />
                <p className="ms-4 font-bold text-sm sm:text-base">{review.author}</p>
                <p className="ms-auto text-xs sm:text-sm text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base">{review.text}</p>
            </div>
          )) : <p className="text-muted-foreground">Be the first to review this product!</p>
        )}
      </div>
      
      <Separator className="my-8" />
      <AddReviewForm productId={productId} onReviewAdded={handleReviewAdded} />
    </div>
  );
}