
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { SiteUser } from '@/lib/types';


interface AuthContextType {
  user: SiteUser | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName: string, gender: 'male' | 'female') => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to create or update user profile in Firestore
const createOrUpdateUserProfile = async (firebaseUser: User, additionalData: Partial<SiteUser> = {}): Promise<SiteUser> => {
    const userDocRef = doc(db, "users", firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        // User document exists, just return the merged data
        const existingData = userDoc.data();
        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            ...existingData,
        } as SiteUser;
    } else {
        // User document does not exist, create it
        const [firstName, ...lastName] = (firebaseUser.displayName || '').split(' ');
        const newUserProfile: Partial<SiteUser> = {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            firstName: firstName || '',
            lastName: lastName.join(' ') || '',
            gender: 'not-specified',
            ...additionalData, // Apply any additional data from sign-up form
        };

        await setDoc(userDocRef, newUserProfile, { merge: true });

        return {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
            ...newUserProfile
        } as SiteUser;
    }
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SiteUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Always fetch the full profile from Firestore to have the most up-to-date data
        const userProfile = await createOrUpdateUserProfile(firebaseUser);
        setUser(userProfile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      // The onAuthStateChanged listener will handle profile creation/retrieval.
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error; // Re-throw the error to be caught by the UI
    }
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string, gender: 'male' | 'female') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update display name in Firebase Auth
    await updateProfile(firebaseUser, { displayName: `${firstName} ${lastName}` });
    
    // Create the user profile document in Firestore with all details
    await createOrUpdateUserProfile(firebaseUser, {
      firstName,
      lastName,
      gender,
    });

    return userCredential;
  }

  const signInWithEmail = async (email: string, password: string) => {
     // onAuthStateChanged will handle setting the user state after successful sign-in.
    return signInWithEmailAndPassword(auth, email, password);
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      // The onAuthStateChanged listener will set user to null
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const value = { user, loading, signInWithGoogle, signUpWithEmail, signInWithEmail, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
