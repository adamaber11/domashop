// src/lib/services/contact-service.ts
'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { ContactMessage } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { unstable_cache as cache } from 'next/cache';

const messagesCollection = collection(db, 'contactMessages');

export async function saveContactMessage(data: { name: string; email: string; subject: string; message: string; }) {
  try {
    await addDoc(messagesCollection, {
      ...data,
      date: Timestamp.now(),
      isRead: false,
    });
    revalidatePath('/admin/messages');
  } catch (error) {
    console.error("Error saving contact message:", error);
    throw new Error('Failed to save message.');
  }
}

export const getAllMessages = cache(async (): Promise<ContactMessage[]> => {
  try {
    const q = query(messagesCollection, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw new Error('Failed to fetch messages.');
  }
}, ['all-messages'], { revalidate: 60 });


export async function markMessageAsRead(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'contactMessages', id);
    await updateDoc(docRef, { isRead: true });
    revalidatePath('/admin/messages');
  } catch (error) {
    console.error(`Error updating message ${id}:`, error);
    throw new Error('Failed to update message status.');
  }
}

export async function deleteMessage(id: string): Promise<void> {
  try {
    const docRef = doc(db, 'contactMessages', id);
    await deleteDoc(docRef);
    revalidatePath('/admin/messages');
  } catch (error) {
    console.error(`Error deleting message ${id}:`, error);
    throw new Error('Failed to delete message.');
  }
}
