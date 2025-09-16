
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SiteUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, ...firebaseUser, ...userDoc.data() } as SiteUser);
        } else {
          // This case handles users created via Google Sign-In for the very first time,
          // or users from a previous auth system without a DB entry.
          // We create a profile for them.
           const [firstName, ...lastName] = firebaseUser.displayName?.split(' ') || ['', ''];
           const newUserProfile = {
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
              firstName: firstName,
              lastName: lastName.join(' '),
              gender: 'not-specified'
            };
          await setDoc(userDocRef, newUserProfile, { merge: true });
          setUser({ uid: firebaseUser.uid, ...firebaseUser, ...newUserProfile } as SiteUser);
        }
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
      // The onAuthStateChanged listener will handle profile creation.
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
      throw error; // Re-throw the error to be caught by the UI
    }
  };

  const signUpWithEmail = async (email: string, password: string, firstName: string, lastName: string, gender: 'male' | 'female') => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    await updateProfile(firebaseUser, { displayName: `${firstName} ${lastName}` });
    
    const userDocRef = doc(db, "users", firebaseUser.uid);
    await setDoc(userDocRef, {
      firstName,
      lastName,
      email: firebaseUser.email,
      displayName: `${firstName} ${lastName}`,
      gender,
    });

    return userCredential;
  }

  const signInWithEmail = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
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
