'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, getCountFromServer } from 'firebase/firestore';
import type { SiteUser, ShippingAddress } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { unstable_cache as cache } from 'next/cache';

const usersCollection = collection(db, 'users');

export const getUserById = cache(async (uid: string): Promise<SiteUser | null> => {
    try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return { uid: userDoc.id, ...userDoc.data() } as SiteUser;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching user ${uid}:`, error);
        throw new Error('Failed to fetch user data.');
    }
}, ['user-by-id', (uid: string) => uid], { revalidate: 60 });

export async function updateUserProfile(uid: string, data: {
    firstName: string;
    lastName: string;
    shippingAddress: ShippingAddress;
}): Promise<void> {
    try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, {
            firstName: data.firstName,
            lastName: data.lastName,
            displayName: `${data.firstName} ${data.lastName}`,
            shippingAddress: data.shippingAddress
        });
        revalidatePath('/account');
    } catch (error) {
        console.error(`Error updating profile for user ${uid}:`, error);
        throw new Error('Failed to update user profile.');
    }
}


export const getAllUsers = cache(async (): Promise<SiteUser[]> => {
  try {
    const usersSnapshot = await getDocs(usersCollection);
    
    const users = usersSnapshot.docs.map(doc => {
      return {
        uid: doc.id,
        ...doc.data()
      } as SiteUser;
    });

    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch users.');
  }
}, ['all-users-for-admin-display'], { revalidate: 60 });

export const getTotalUsersCount = cache(async (): Promise<number> => {
    try {
        const snapshot = await getCountFromServer(usersCollection);
        return snapshot.data().count;
    } catch (error) {
        console.error('Error fetching total users count:', error);
        throw new Error('Failed to fetch user count.');
    }
}, ['total-users-count'], { revalidate: 60 });


export async function deleteUser(uid: string): Promise<void> {
    // Note: This function only deletes the Firestore user document.
    // Deleting a user from Firebase Authentication requires admin privileges
    // and should be handled in a secure backend environment (e.g., Cloud Function).
    try {
        const userDocRef = doc(db, 'users', uid);
        await deleteDoc(userDocRef);
        revalidatePath('/admin/users');
    } catch (error) {
        console.error(`Error deleting user document for ${uid}:`, error);
        throw new Error('Failed to delete user data.');
    }
}
