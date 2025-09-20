

'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, query, where, limit, orderBy, addDoc, updateDoc, deleteDoc, writeBatch, setDoc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { unstable_cache as cache, revalidatePath } from 'next/cache';
import placeholderImages from '@/app/lib/placeholder-images.json';


// Helper to ensure product has valid image URLs
function ensureProductImages(product: any): Product {
    const defaultPlaceholder = placeholderImages['prod_001'] || { src: "https://placehold.co/800x600/E2D6C5/443027", hint: "default product" };
    
    // If imageUrls doesn't exist or is not an array, create it from the placeholder.
    if (!product.imageUrls || !Array.isArray(product.imageUrls) || product.imageUrls.length === 0) {
        product.imageUrls = [defaultPlaceholder.src, defaultPlaceholder.src, defaultPlaceholder.src];
    }
    if (!product.imageHint) {
        product.imageHint = defaultPlaceholder.hint;
    }
     // Ensure numeric fields are numbers, providing defaults if they don't exist.
    product.price = product.price ?? 0;
    product.salePrice = product.salePrice ?? undefined;
    product.reviewCount = product.reviewCount ?? 0;
    product.averageRating = product.averageRating ?? 0;
    product.stock = product.stock ?? 0;

    return product as Product;
}


export const getProductById = cache(async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const productData = { id: docSnap.id, ...docSnap.data() };
      return ensureProductImages(productData);
    } else {
      console.warn(`No product found with id: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error('Failed to fetch product data.');
  }
}, ['product-by-id', (id: string) => id], { revalidate: 60 });


export const getAllProducts = cache(async (): Promise<Product[]> => {
  try {
    const querySnapshot = await getDocs(query(productsCollection, orderBy('name')));
    return querySnapshot.docs.map(doc => {
        const productData = { id: doc.id, ...doc.data() };
        return ensureProductImages(productData);
    });
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw new Error('Failed to fetch products.');
  }
}, ['all-products'], { revalidate: 60 });


export const getProductsByCategoryName = cache(async (categoryName: string): Promise<Product[]> => {
  try {
    const q = query(productsCollection, where('category', '==', categoryName));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const productData = { id: doc.id, ...doc.data() };
      return ensureProductImages(productData);
    });
  } catch (error) {
    console.error(`Error fetching products for category ${categoryName}:`, error);
    throw new Error('Failed to fetch category products.');
  }
}, ['products-by-category-name', (name: string) => name], { revalidate: 60 });


export const getOnSaleProducts = cache(async (): Promise<Product[]> => {
  try {
    const q = query(productsCollection, where('onSale', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const productData = { id: doc.id, ...doc.data() };
        return ensureProductImages(productData);
    });
  } catch (error) {
    console.error("Error fetching on-sale products:", error);
    throw new Error('Failed to fetch on-sale products.');
  }
}, ['on-sale-products'], { revalidate: 60 });


export const getFeaturedProducts = cache(async (count: number): Promise<Product[]> => {
   try {
    const q = query(productsCollection, where('isFeatured', '==', true), limit(count));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
        const productData = { id: doc.id, ...doc.data() };
        return ensureProductImages(productData);
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    // Fallback in case of index error etc.
    const fallbackQuery = query(productsCollection, limit(count));
    const fallbackSnapshot = await getDocs(fallbackQuery);
    return fallbackSnapshot.docs.map(doc => {
        const productData = { id: doc.id, ...doc.data() };
        return ensureProductImages(productData);
    });
  }
}, ['featured-products', (count: number) => count.toString()], { revalidate: 60 });


export async function searchProducts(searchQuery: string, count: number): Promise<Product[]> {
  try {
    // Split the search query into individual words and convert to lower case
    const searchWords = searchQuery.toLowerCase().split(' ').filter(word => word);

    // This is not cached as it's a dynamic user-driven search
    const products = await getAllProducts();
    
    const filteredProducts = products.filter(product => {
        const productNameLower = product.name.toLowerCase();
        // Check if all search words are present in the product name
        return searchWords.every(word => productNameLower.includes(word));
      });

    return filteredProducts.slice(0, count);

  } catch (error) {
    console.error(`Error searching products with query "${searchQuery}":`, error);
    throw new Error('Failed to search for products.');
  }
}


export async function addProduct(productData: Omit<Product, 'id' | 'reviewCount' | 'averageRating'>, id: string): Promise<string> {
  try {
    const docRef = doc(db, 'products', id);
    await setDoc(docRef, {
      ...productData,
      reviewCount: 0,
      averageRating: 0,
      stock: productData.stock ?? 0,
      isFeatured: productData.isFeatured || false,
    });
    revalidatePath('/admin/products');
    revalidatePath('/admin/analytics');
    revalidatePath('/');
    return id;
  } catch (error) {
    console.error("Error adding product:", error);
    throw new Error('Failed to add product.');
  }
}

export async function updateProduct(id: string, productData: Partial<Omit<Product, 'id'>>): Promise<void> {
  try {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, productData);
    revalidatePath('/admin/products');
    revalidatePath(`/products/${id}`);
    revalidatePath('/admin/analytics');
    revalidatePath('/');
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

        revalidatePath('/admin/products');
        revalidatePath(`/products/${id}`);
        revalidatePath('/admin/analytics');
        revalidatePath('/');
    } catch (error) {
        console.error(`Error deleting product ${id} and its reviews:`, error);
        throw new Error('Failed to delete product.');
    }
}
