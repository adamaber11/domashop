import type { User as FirebaseUser } from 'firebase/auth';

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
export interface SiteUser extends FirebaseUser {
  firstName?: string;
  lastName?: string;
  gender?: 'male' | 'female' | 'not-specified';
}
