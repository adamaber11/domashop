import type { User as FirebaseUser, UserInfo, UserMetadata } from 'firebase/auth';
import type { Timestamp } from 'firebase/firestore';


export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string; // Should be ISO 8601 format
  productId: string;
  userId: string;
};

export type Product = {
  id:string;
  name: string;
  description: string;
  price: number;
  onSale?: boolean;
  salePrice?: number;
  category: string;
  imageUrls: string[];
  imageHint: string;
  reviewCount: number;
  averageRating: number;
  isFeatured?: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type ShippingAddress = {
    address: string;
    city: string;
    state: string;
    zip: string;
};

export type Order = {
    id: string;
    userId: string;
    customerName: string;
    customerEmail: string;
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: Timestamp;
    items: CartItem[];
    shippingAddress: ShippingAddress;
};


// Extends Firebase's User type with our custom fields
// and fields from Firebase Admin SDK's UserRecord
export interface SiteUser extends Omit<FirebaseUser, 'metadata'> {
  firstName?: string;
  lastName?: string;
  shippingAddress?: ShippingAddress;
  gender?: 'male' | 'female' | 'not-specified';
  // Properties from firebase-admin UserRecord
  metadata?: UserMetadata;
  disabled?: boolean;
  emailVerified?: boolean;
  providerData?: UserInfo[];
  toJSON?: () => object;
}

export interface HeroImage {
  src: string;
  alt: string;
  hint: string;
}

export interface SiteSettings {
  id: string;
  welcomeHeadline: string;
  welcomeSubheading: string;
  logoTextPart1: string;
  logoTextPart2: string;
  logoTextPart3: string;
  socials: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
  };
  heroImages: HeroImage[];
  heroCarouselDelay: number;
}


export interface AboutPageContent {
  headline: string;
  subheading: string;
  mission: string;
  vision: string;
  founderName: string;
  founderTitle: string;
  bannerImageUrl: string;
  founderImageUrl: string;
}

export interface ContactPageContent {
  headline: string;
  subheading: string;
  address: string;
  phone: string;
  email: string;
}

export interface PagesContent {
  about: AboutPageContent;
  contact: ContactPageContent;
}
