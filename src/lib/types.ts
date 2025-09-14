import type { User as FirebaseUser, UserInfo, UserMetadata } from 'firebase/auth';

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
  id: string;
  name: string;
  description: string;
  price: number;
  onSale?: boolean;
  salePrice?: number;
  category: string;
  imageIds: string[];
  imageHint: string;
  reviewCount: number;
  averageRating: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

// Extends Firebase's User type with our custom fields
// and fields from Firebase Admin SDK's UserRecord
export interface SiteUser extends Omit<FirebaseUser, 'metadata'> {
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | 'not-specified';
  // Properties from firebase-admin UserRecord
  metadata?: UserMetadata;
  disabled?: boolean;
  emailVerified?: boolean;
  providerData?: UserInfo[];
  toJSON?: () => object;
}
