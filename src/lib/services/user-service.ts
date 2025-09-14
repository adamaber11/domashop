'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
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
    
    const users = usersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        ...data,
        // Mocking fields that would normally come from Auth
        emailVerified: true, 
        disabled: false,
        metadata: {
            creationTime: new Date().toISOString(),
            lastSignInTime: new Date().toISOString(),
        }
      } as SiteUser;
    });

    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch users.');
  }
}
