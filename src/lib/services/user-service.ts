
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import type { SiteUser, ShippingAddress } from '@/lib/types';
import { revalidatePath } from 'next/cache';


export async function getUserById(uid: string): Promise<SiteUser | null> {
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
}

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


export async function getAllUsers(): Promise<SiteUser[]> {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    
    // This function is for admin display purposes.
    // Avoid returning sensitive or unnecessary data.
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        email: data.email,
        displayName: data.displayName,
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL: data.photoURL,
        // Mocking fields for display, as full Auth UserRecord is not available client-side
        metadata: {
            creationTime: new Date().toISOString(), // This is not the real creation time
            lastSignInTime: new Date().toISOString(), // This is not the real sign-in time
        }
      } as SiteUser;
    });

    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch users.');
  }
}

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
