'use client';

import { useEffect, useState } from 'react';
import { getPersonalizedRecommendations } from '@/ai/flows/personalized-product-recommendations';
import { getProductsByCategoryName } from '@/lib/services/product-service';
import type { Product } from '@/lib/types';
import { ProductCard } from './product-card';
import { Skeleton } from './ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getProductById } from '@/lib/services/product-service';

interface PersonalizedRecommendationsProps {
  currentProductId: string;
}

export default function PersonalizedRecommendations({ currentProductId }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        // In a real app, browsing and purchase history would come from the user's account data.
        // We simulate it here for demonstration.
        const browsingHistory = 'prod_002,prod_005';
        const purchaseHistory = 'prod_008';

        const result = await getPersonalizedRecommendations({
          browsingHistory,
          purchaseHistory,
          numberOfRecommendations: 4,
        });

        const recommendedProducts = (await Promise.all(
          result.recommendations.map(id => getProductById(id.trim()))
        )).filter((p): p is Product => !!p && p.id !== currentProductId);
          
        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error('Failed to get AI recommendations, falling back to category based:', error);
        // Fallback to simple category-based recommendations
        const currentProduct = await getProductById(currentProductId);
        if (currentProduct) {
          const fallbackRecs = (await getProductsByCategoryName(currentProduct.category))
            .filter(p => p.id !== currentProductId)
            .slice(0, 3);
          setRecommendations(fallbackRecs);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentProductId]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-24 w-24 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Carousel opts={{ align: "start", loop: recommendations.length > 1 }} className="w-full">
      <CarouselContent>
        {recommendations.map(product => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-full">
              <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      {recommendations.length > 1 && (
        <>
          <CarouselPrevious className="hidden sm:flex"/>
          <CarouselNext className="hidden sm:flex"/>
        </>
      )}
    </Carousel>
  );
}
