'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, runTransaction, query, where, orderBy, Timestamp } from 'firebase/firestore';
import type { Review } from '@/lib/types';

type NewReview = Omit<Review, 'id' | 'date' | 'productId'>;

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
  try {
    const reviewsCollection = collection(db, 'reviews');
    const q = query(reviewsCollection, where('productId', '==', productId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: (data.date as Timestamp).toDate().toISOString(),
        } as Review;
    });
  } catch (error) {
    console.error(`Error fetching reviews for product ${productId}:`, error);
    throw new Error('Failed to fetch reviews.');
  }
}

export async function addReview(productId: string, reviewData: NewReview): Promise<string> {
    try {
        const productRef = doc(db, 'products', productId);
        const reviewsCollection = collection(db, 'reviews');

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

        return newReviewRef.id;

    } catch (error) {
        console.error(`Error adding review to product ${productId}:`, error);
        throw new Error('Failed to add review.');
    }
}
