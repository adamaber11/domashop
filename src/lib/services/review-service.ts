'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, runTransaction, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Review } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { unstable_cache as cache } from 'next/cache';

type NewReviewData = Omit<Review, 'id' | 'date' | 'productId'>;

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
}, ['reviews-by-product-id', (id: string) => id], { revalidate: 60 });

export async function addReview(productId: string, reviewData: NewReviewData): Promise<Review> {
    try {
        const productRef = doc(db, 'products', productId);
        const newReviewRef = doc(collection(db, 'reviews')); // Create a ref with a new ID

        let newReview: Review | null = null;

        await runTransaction(db, async (transaction) => {
            const productDoc = await transaction.get(productRef);
            if (!productDoc.exists()) {
                throw new Error("Product not found!");
            }

            const now = Timestamp.now();
            // Create the new review
            const reviewToSave = {
                ...reviewData,
                productId: productId,
                date: now,
            };
            transaction.set(newReviewRef, reviewToSave);

             newReview = {
                ...reviewToSave,
                id: newReviewRef.id,
                date: now.toDate().toISOString()
             } as Review;


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

        if (!newReview) {
            throw new Error("Review could not be created.");
        }

        // Revalidate the product page path to show the new review
        revalidatePath(`/products/${productId}`);

        return newReview;

    } catch (error) {
        console.error(`Error adding review to product ${productId}:`, error);
        throw new Error('Failed to add review.');
    }
}
