"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/types';
import { Plus, Minus, ShoppingCart } from 'lucide-react';

export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  }

  const decrementQuantity = () => {
    setQuantity(prev => Math.max(1, prev - 1));
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={decrementQuantity} aria-label="Decrease quantity">
          <Minus className="h-4 w-4" />
        </Button>
        <Input 
          type="number"
          className="w-16 text-center" 
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
          aria-label="Product quantity"
        />
        <Button variant="outline" size="icon" onClick={incrementQuantity} aria-label="Increase quantity">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button onClick={handleAddToCart} size="lg">
        <ShoppingCart className="mr-2 h-5 w-5" />
        Add to Cart
      </Button>
    </div>
  );
}
