'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { SiteSettings } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const SETTINGS_DOC_ID = 'siteConfig';
const settingsDocRef = doc(db, 'settings', SETTINGS_DOC_ID);

const defaultSettings: Omit<SiteSettings, 'id'> = {
  welcomeHeadline: 'Welcome to Doma Online Shop',
  welcomeSubheading: 'Discover a world of quality products, curated just for you. Your blissful shopping journey starts here.',
  logoTextPart1: 'Do',
  logoTextPart2: 'm',
  logoTextPart3: 'a',
  socials: {
    facebook: '#',
    twitter: '#',
    instagram: '#',
    linkedin: '#',
  },
  heroImages: [
    { src: "https://picsum.photos/seed/101/1200/500", alt: "A stunning landscape with mountains and a lake.", hint: "landscape mountains" },
    { src: "https://picsum.photos/seed/102/1200/500", alt: "A modern city skyline at night with illuminated buildings.", hint: "city skyline" },
    { src: 'https://picsum.photos/seed/welcome-hero/1200/500', alt: 'Welcome banner', hint: 'store interior' }
  ],
  heroCarouselDelay: 4000,
  currencies: [
    { code: 'USD', name: 'US Dollar', rate: 1 },
    { code: 'EUR', name: 'Euro', rate: 0.93 },
    { code: 'EGP', name: 'Egyptian Pound', rate: 47.50 },
    { code: 'SAR', name: 'Saudi Riyal', rate: 3.75 },
  ]
};

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const docSnap = await getDoc(settingsDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Merge with defaults to ensure new fields exist
      const settings = { ...defaultSettings, ...data };
      if (!settings.currencies || settings.currencies.length === 0) {
        settings.currencies = defaultSettings.currencies;
      }
      return { id: docSnap.id, ...settings } as SiteSettings;
    } else {
      // If settings don't exist, create them with default values
      await setDoc(settingsDocRef, defaultSettings);
      console.log("Created default site settings in Firestore.");
      return { id: SETTINGS_DOC_ID, ...defaultSettings };
    }
  } catch (error) {
    console.error("Error fetching site settings:", error);
    // Return default settings on error to prevent site crash
    return { id: SETTINGS_DOC_ID, ...defaultSettings };
  }
}

export async function updateSiteSettings(settingsData: Omit<SiteSettings, 'id'>): Promise<void> {
  try {
    await setDoc(settingsDocRef, settingsData, { merge: true });
    // Revalidate all pages that might use this global data
    revalidatePath('/');
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/admin/settings');
  } catch (error) {
    console.error("Error updating site settings:", error);
    throw new Error('Failed to update site settings.');
  }
}
