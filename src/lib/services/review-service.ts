'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, runTransaction, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Review } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { unstable_cache as cache } from 'next/cache';

type NewReview = Omit<Review, 'id' | 'date' | 'productId'>;

export const getReviewsByProductId = cache(async (productId: string): Promise<Review[]> => {
  try {
    const reviewsCollection = collection(db, 'reviews');
    // Removed orderBy('date', 'desc') to avoid composite index requirement.
    // Sorting will be done in-memory after fetching.
    const q = query(reviewsCollection, where('productId', '==', productId));
    const querySnapshot = await getDocs(q);
    
    const reviews = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
        } as Review;
    });

    // Sort by date in descending order (newest first)
    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw new Error('Failed to fetch reviews.');
  }
}, ['reviews-by-product-id'], { revalidate: 60 });

export async function addReview(productId: string, reviewData: NewReview): Promise<string> {
    try {
        const productRef = doc(db, 'products', productId);
        const newReviewRef = doc(collection(db, 'reviews')); // Create a ref with a new ID

        await runTransaction(db, async (transaction) => {
            const productDoc = await transaction.get(productRef);
            if (!productDoc.exists()) {
                throw new Error("Product not found!");
            }

            // Create the new review
            const newReview = {
                ...reviewData,
                productId: productId,
                date: Timestamp.now(),
            };
            transaction.set(newReviewRef, newReview);

            // Update the product's aggregate review data
            const productData = productDoc.data();
            const newReviewCount = (productData.reviewCount || 0) + 1;
            const oldRatingTotal = (productData.averageRating || 0) * (productData.reviewCount || 0);
            const newAverageRating = (oldRatingTotal + reviewData.rating) / newReviewCount;

            transaction.update(productRef, {
                reviewCount: newReviewCount,
                averageRating: newAverageRating,
            });
        });

        // Revalidate the product page path to show the new review
        revalidatePath(`/products/${productId}`);

        return newReviewRef.id;

    } catch (error) {
        console.error(`Error adding review to product ${productId}:`, error);
        throw new Error('Failed to add review.');
    }
}
