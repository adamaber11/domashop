'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, cartTotal, itemCount } = useCart();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-headline text-4xl font-bold mb-8">Your Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <Card className="text-center py-12">
            <CardHeader>
                <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
                <Button asChild>
                    <Link href="/">Continue Shopping</Link>
                </Button>
            </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {cart.map(({ product, quantity }) => {
              const placeholder = PlaceHolderImages.find(p => p.id === product.imageId);
              return (
                <Card key={product.id} className="flex items-center p-4">
                  <div className="w-24 h-24 relative mr-4">
                    {placeholder && (
                      <Image
                        src={placeholder.imageUrl}
                        alt={product.name}
                        fill
                        className="rounded-md object-cover"
                        data-ai-hint={product.imageHint}
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    <Link href={`/products/${product.id}`} className="font-semibold hover:text-primary">{product.name}</Link>
                    <p className="text-muted-foreground">${product.price.toFixed(2)}</p>
                    <div className="flex items-center mt-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)}><Minus className="h-4 w-4" /></Button>
                        <Input type="number" value={quantity} readOnly className="h-8 w-12 text-center mx-1" />
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-lg">${(product.price * quantity).toFixed(2)}</p>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(product.id)}>
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild size="lg" className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
