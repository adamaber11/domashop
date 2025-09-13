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
