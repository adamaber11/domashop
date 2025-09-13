'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit, orderBy, addDoc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import type { Product } from '@/lib/types';

const productsCollection = collection(db, 'products');

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // The document data is cast to a Product type, but we also add the id
      const productData = { id: docSnap.id, ...docSnap.data() } as Product;
      
      // Ensure numeric fields are numbers, providing defaults if they don't exist.
      productData.price = productData.price ?? 0;
      productData.salePrice = productData.salePrice ?? undefined;
      productData.reviewCount = productData.reviewCount ?? 0;
      productData.averageRating = productData.averageRating ?? 0;
      
      return productData;
    } else {
      console.warn(`No product found with id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error('Failed to fetch product data.');
  }
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(productsCollection);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw new Error('Failed to fetch products.');
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const q = query(productsCollection, where('category', '==', category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    throw new Error('Failed to fetch category products.');
  }
}

export async function getFeaturedProducts(count: number): Promise<Product[]> {
   try {
    const q = query(productsCollection, orderBy('averageRating', 'desc'), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw new Error('Failed to fetch featured products.');
  }
}

export async function searchProducts(searchQuery: string, count: number): Promise<Product[]> {
  try {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const q = query(
      productsCollection,
      orderBy('name'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    
    // Manual client-side filtering because Firestore doesn't support case-insensitive "contains" search
    const products = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as Product))
      .filter(product => product.name.toLowerCase().includes(lowerCaseQuery));

    return products.slice(0, count);

  } catch (error) {
    console.error(`Error searching products with query "${searchQuery}":`, error);
    throw new Error('Failed to search for products.');
  }
}

export async function addProduct(productData: Omit<Product, 'id' | 'reviewCount' | 'averageRating'>): Promise<string> {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      reviewCount: 0,
      averageRating: 0,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error('Failed to add product.');
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw new Error('Failed to update product.');
  }
}

export async function deleteProduct(id: string): Promise<void> {
    try {
        const batch = writeBatch(db);

        // Delete the product document
        const productRef = doc(db, 'products', id);
        batch.delete(productRef);

        // Find and delete all reviews associated with the product
        const reviewsQuery = query(collection(db, 'reviews'), where('productId', '==', id));
        const reviewsSnapshot = await getDocs(reviewsQuery);
        reviewsSnapshot.forEach(reviewDoc => {
            batch.delete(reviewDoc.ref);
        });

        await batch.commit();
    } catch (error) {
        console.error(`Error deleting product ${id} and its reviews:`, error);
        throw new Error('Failed to delete product.');
    }
}