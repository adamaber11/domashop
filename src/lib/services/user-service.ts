'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { SiteUser } from '@/lib/types';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

// Initialize Firebase Admin SDK
const adminApp = getFirebaseAdminApp();

export async function getAllUsers(): Promise<SiteUser[]> {
  try {
    const listUsersResult = await getAuth(adminApp).listUsers();
    const firestoreUsersSnap = await getDocs(collection(db, 'users'));
    
    const firestoreUsersData: { [uid: string]: any } = {};
    firestoreUsersSnap.forEach(doc => {
      firestoreUsersData[doc.id] = doc.data();
    });

    const combinedUsers = listUsersResult.users.map(userRecord => {
      const firestoreData = firestoreUsersData[userRecord.uid] || {};
      const combinedUser: SiteUser = {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        emailVerified: userRecord.emailVerified,
        disabled: userRecord.disabled,
        metadata: userRecord.metadata,
        providerData: userRecord.providerData,
        toJSON: userRecord.toJSON,
        ...firestoreData
      };
      return combinedUser;
    });

    return combinedUsers as SiteUser[];
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw new Error('Failed to fetch users.');
  }
}
