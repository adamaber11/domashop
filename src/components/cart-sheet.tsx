
'use client';

import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollArea } from './ui/scroll-area';
import { SheetFooter } from './ui/sheet';
import { useCurrency } from '@/context/currency-context';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';


interface CartSheetContentProps {
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export function CartSheetContent({ onCheckout, onContinueShopping }: CartSheetContentProps) {
  const { cart, updateQuantity, removeFromCart, cartTotal, itemCount } = useCart();
  const { selectedCurrency } = useCurrency();
  const router = useRouter();

  const handleCheckout = () => {
    onCheckout?.();
    router.push('/checkout');
  };


  return (
    <div className="flex flex-col h-full">
      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-2xl font-semibold mt-4 mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Looks like you haven't added anything yet.</p>
             <Button asChild>
                <Link href="/category" onClick={onContinueShopping}>Continue Shopping</Link>
            </Button>
        </div>
      ) : (
        <>
            <ScrollArea className="flex-grow pe-4">
                <div className="space-y-4">
                    {cart.map(({ product, quantity }) => {
                    const imageUrl = product.imageUrls?.[0];
                    const price = product.onSale && product.salePrice ? product.salePrice : product.price;
                    return (
                        <div key={product.id} className="flex items-start p-2 border-b">
                            <div className="w-20 h-20 relative me-4 flex-shrink-0">
                                {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt={product.name}
                                    fill
                                    className="rounded-md object-cover"
                                    data-ai-hint={product.imageHint}
                                />
                                )}
                            </div>
                            <div className="flex-grow">
                                <Link href={`/products/${product.id}`} className="font-semibold text-sm hover:text-primary">{product.name}</Link>
                                <p className="text-muted-foreground text-xs">{formatPrice(price, selectedCurrency)}</p>
                                <div className="flex items-center mt-2">
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, quantity - 1)}><Minus className="h-3 w-3" /></Button>
                                    <Input type="number" value={quantity} readOnly className="h-7 w-10 text-center mx-1 text-sm" />
                                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(product.id, quantity + 1)}><Plus className="h-3 w-3" /></Button>
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <p className="font-semibold text-sm">{formatPrice(price * quantity, selectedCurrency)}</p>
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-7 w-7" onClick={() => removeFromCart(product.id)}>
                                <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    );
                    })}
                </div>
            </ScrollArea>

            <SheetFooter className="mt-auto pt-6 pb-2 px-0 flex-col space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Subtotal ({itemCount} items)</span>
                        <span>{formatPrice(cartTotal, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>Free</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>{formatPrice(cartTotal, selectedCurrency)}</span>
                    </div>
                </div>
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
            </SheetFooter>
        </>
      )}
    </div>
  );
}
