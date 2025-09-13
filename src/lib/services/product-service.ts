'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit, orderBy } from 'firebase/firestore';
import type { Product } from '@/lib/types';

const productsCollection = collection(db, 'products');

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
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
    // This is a simple implementation. A real app might have a 'featured' flag.
    // Here we get products with the highest average rating.
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
    // Firestore doesn't support native full-text search.
    // This is a basic "starts-with" search. For real applications, use a dedicated search service like Algolia or Elasticsearch.
    const q = query(
      productsCollection,
      where('name', '>=', searchQuery),
      where('name', '<=', searchQuery + '\uf8ff'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } catch (error) {
    console.error(`Error searching products with query "${searchQuery}":`, error);
    throw new Error('Failed to search for products.');
  }
}
