"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/cart-context';
import type { Product } from '@/lib/types';
import { Plus, Minus, ShoppingBag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';


export function AddToCartButton({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const isOutOfStock = product.stock <= 0;


  const handleAddToCart = () => {
    if (loading) return; // Do nothing while auth state is loading
    
    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to add items to the cart.',
        variant: 'destructive',
      });
      router.push('/login');
    } else {
      addToCart(product, quantity);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > product.stock) {
      toast({
        title: "Limited Stock",
        description: `You can only add up to ${product.stock} items.`,
        variant: "destructive",
      });
      setQuantity(product.stock);
    } else {
      setQuantity(Math.max(1, newQuantity));
    }
  }

  const incrementQuantity = () => {
    handleQuantityChange(quantity + 1);
  }

  const decrementQuantity = () => {
    handleQuantityChange(quantity - 1);
  }

  return (
    <div className="flex items-center space-x-4 rtl:space-x-reverse">
      <div className="flex items-center">
        <Button variant="outline" size="icon" onClick={decrementQuantity} aria-label="Decrease quantity" disabled={isOutOfStock}>
          <Minus className="h-4 w-4" />
        </Button>
        <Input 
          type="number"
          className="w-16 text-center" 
          value={quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
          aria-label="Product quantity"
          disabled={isOutOfStock}
          max={product.stock}
        />
        <Button variant="outline" size="icon" onClick={incrementQuantity} aria-label="Increase quantity" disabled={isOutOfStock}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <Button onClick={handleAddToCart} size="lg" disabled={loading || isOutOfStock}>
        <ShoppingBag className="me-2 h-5 w-5" />
        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
      </Button>
    </div>
  );
}
