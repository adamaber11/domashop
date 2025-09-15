
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { PagesContent, AboutPageContent, ContactPageContent } from '@/lib/types';
import { revalidatePath } from 'next/cache';

const PAGES_COLLECTION = 'pages';
const ABOUT_DOC_ID = 'about';
const CONTACT_DOC_ID = 'contact';

const defaultAboutContent: AboutPageContent = {
  headline: "About Doma Online Shop",
  subheading: "Your trusted partner in discovering quality, style, and innovation. We are more than just a store; we are a community of enthusiasts dedicated to bringing you the best.",
  mission: "To provide an unparalleled online shopping experience by offering a curated selection of high-quality products, exceptional customer service, and a seamless, user-friendly platform. We aim to inspire and delight our customers with every click.",
  vision: "To be the go-to online destination for shoppers seeking unique and inspiring products. We envision a world where shopping is not just a transaction, but an experience of discovery and joy.",
  founderName: "Eng. Adam Aber Desouky",
  founderTitle: "CEO & Founder",
  bannerImageUrl: "https://picsum.photos/seed/about/1600/600",
  founderImageUrl: "https://picsum.photos/seed/team1/200",
};

const defaultContactContent: ContactPageContent = {
  headline: "Contact Us",
  subheading: "Have questions or feedback? We'd love to hear from you. Reach out to us, and we'll respond as soon as possible.",
  address: "123 Main Street\nAnytown, USA 12345",
  phone: "(123) 456-7890",
  email: "contact@doma.com",
};

async function getOrCreateDocument<T>(docRef: any, defaultData: T): Promise<T> {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // Merge with defaults to ensure all fields are present
        return { ...defaultData, ...docSnap.data() };
    } else {
        await setDoc(docRef, defaultData);
        return defaultData;
    }
}


export async function getPagesContent(): Promise<PagesContent> {
  try {
    const aboutDocRef = doc(db, PAGES_COLLECTION, ABOUT_DOC_ID);
    const contactDocRef = doc(db, PAGES_COLLECTION, CONTACT_DOC_ID);

    const [about, contact] = await Promise.all([
      getOrCreateDocument(aboutDocRef, defaultAboutContent),
      getOrCreateDocument(contactDocRef, defaultContactContent),
    ]);

    return { about, contact };
  } catch (error) {
    console.error("Error fetching page content:", error);
    // Return default content on error to prevent site crash
    return {
      about: defaultAboutContent,
      contact: defaultContactContent,
    };
  }
}

export async function updatePagesContent(content: PagesContent): Promise<void> {
  try {
    const aboutDocRef = doc(db, PAGES_COLLECTION, ABOUT_DOC_ID);
    const contactDocRef = doc(db, PAGES_COLLECTION, CONTACT_DOC_ID);

    await Promise.all([
        setDoc(aboutDocRef, content.about, { merge: true }),
        setDoc(contactDocRef, content.contact, { merge: true }),
    ]);

    // Revalidate paths that use this data
    revalidatePath('/about');
    revalidatePath('/contact');
    revalidatePath('/admin/pages');

  } catch (error) {
    console.error("Error updating page content:", error);
    throw new Error('Failed to update page content.');
  }
}
