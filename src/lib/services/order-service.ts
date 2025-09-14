'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const ordersCollection = collection(db, 'orders');

export async function getAllOrders(): Promise<Order[]> {
  try {
    const q = query(ordersCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ 
        id: doc.id,
        ...doc.data()
    } as Order));
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw new Error('Failed to fetch orders.');
  }
}

export async function addOrder(orderData: Omit<Order, 'id' | 'date'>): Promise<string> {
  try {
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      date: Timestamp.now(),
    });
    // Revalidate paths that show order data
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/orders');
    revalidatePath('/admin/analytics');
    revalidatePath('/account');
    return docRef.id;
  } catch (error) {
    console.error("Error adding order:", error);
    throw new Error('Failed to add order.');
  }
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  try {
    const docRef = doc(db, 'orders', id);
    await updateDoc(docRef, { status });
     // Revalidate paths that show order status
    revalidatePath('/admin/dashboard');
    revalidatePath('/admin/orders');
    revalidatePath('/account');
  } catch (error) {
    console.error(`Error updating order status for ${id}:`, error);
    throw new Error('Failed to update order status.');
  }
}
