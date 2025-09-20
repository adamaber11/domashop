
// scripts/seed.ts
import { collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { products as mockProducts } from '@/lib/data';
import type { Product, Review } from '@/lib/types';
import placeholderImages from '@/app/lib/placeholder-images.json';

// Helper to safely get placeholder images
const getProductImages = (productId: keyof typeof placeholderImages) => {
    const placeholder = placeholderImages[productId] || { src: "https://placehold.co/800x600/E2D6C5/443027", hint: "default product" };
    // For seeding, we can just use the same image for all 3 slots if only one is defined.
    return [placeholder.src, placeholder.src, placeholder.src];
};
const getProductHint = (productId: keyof typeof placeholderImages) => {
    return (placeholderImages[productId] || { hint: "default product" }).hint;
};


async function seedDatabase() {
  console.log('Starting to seed the database...');

  const productsCollection = collection(db, 'products');
  const reviewsCollection = collection(db, 'reviews');
  const batch = writeBatch(db);

  for (const mockProduct of mockProducts) {
    const { reviews: mockReviews, ...productData } = mockProduct;

    const productRef = doc(productsCollection, productData.id);

    // Calculate review aggregates
    const reviewCount = mockReviews.length;
    const averageRating =
      reviewCount > 0
        ? mockReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
        : 0;

    const finalProductData: Omit<Product, 'reviews'> = {
      ...productData,
      reviewCount,
      averageRating,
      stock: productData.stock ?? 15, // Add default stock
      imageUrls: getProductImages(productData.id as keyof typeof placeholderImages),
      imageHint: getProductHint(productData.id as keyof typeof placeholderImages)
    };
    
    batch.set(productRef, finalProductData);
    console.log(`Added product ${finalProductData.name} to batch.`);

    // Add reviews to the 'reviews' collection
    for (const mockReview of mockReviews) {
      const reviewRef = doc(reviewsCollection);
      
      const reviewData: Omit<Review, 'id'> = {
        author: mockReview.author,
        rating: mockReview.rating,
        text: mockReview.text,
        date: new Date(mockReview.date).toISOString(), // Ensure date is in ISO format
        productId: productData.id,
        userId: `mock_user_${Math.random().toString(36).substring(7)}` // Create a mock user ID
      };

      batch.set(reviewRef, reviewData);
      console.log(`Added review by ${reviewData.author} for product ${productData.name} to batch.`);
    }
  }

  try {
    await batch.commit();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

seedDatabase();
