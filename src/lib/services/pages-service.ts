
'use server';

import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { PagesContent, AboutPageContent, ContactPageContent } from '@/lib/types';
import { revalidatePath } from 'next/cache';
import { unstable_cache as cache } from 'next/cache';


const PAGES_COLLECTION = 'pages';
const ABOUT_DOC_ID = 'about';
const CONTACT_DOC_ID = 'contact';

const defaultAboutContent: AboutPageContent = {
  headline: "عالمك الخاص... كل ما تحتاجينه",
  subheading: "مرحبًا بكِ في وجهتك الأولى لكل ما هو عصري ومميز. من الأزياء والجمال إلى الإكسسوارات التي تبرز شخصيتك، نحن هنا لنلبي كل احتياجاتك.",
  mission: "مهمتنا هي توفير تجربة تسوق فريدة وممتعة، نقدم فيها تشكيلة واسعة من المنتجات عالية الجودة التي تم اختيارها بعناية لتناسب ذوق كل فتاة عصرية. نسعى لإلهامك ومساعدتك على التعبير عن نفسك بثقة.",
  vision: "رؤيتنا هي أن نكون المتجر الإلكتروني الرائد الذي تجد فيه كل فتاة ما يعكس أسلوبها وشغفها. نحلم بعالم يكون فيه التسوق رحلة لاكتشاف الذات والجمال.",
  founderName: "Eng. Adam Aber Desouky",
  founderTitle: "CEO & Founder",
  bannerImageUrl: "https://picsum.photos/seed/about-girls/1600/600",
  founderImageUrl: "https://picsum.photos/seed/team1/200",
};

const defaultContactContent: ContactPageContent = {
  headline: "Contact Us",
  subheading: "Have questions or feedback? We'd love to hear from you. Reach out to us, and we'll respond as soon as possible.",
  address: "123 Main Street\nAnytown, USA 12345",
  phone: "01284648993",
  email: "adamaber50@gmail.com",
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


export const getPagesContent = cache(async (): Promise<PagesContent> => {
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
}, ['pages-content'], { revalidate: 60 });

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
