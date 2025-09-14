'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { SiteUser } from '@/lib/types';

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
