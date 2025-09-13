export type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
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
  reviews: Review[];
};

export type CartItem = {
  product: Product;
  quantity: number;
};
