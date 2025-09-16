
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { addOrder } from '@/lib/services/order-service';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/context/currency-context';
import { formatPrice } from '@/lib/utils';
import { getUserById } from '@/lib/services/user-service';

const formSchema = z.object({
  email: z.string().email(),
  shippingName: z.string().min(2, 'Name is too short'),
  shippingPhone: z.string().min(10, 'Phone number is required'),
  shippingAddress: z.string().min(5, 'Address is too short'),
  shippingCity: z.string().min(2, 'City is too short'),
  shippingState: z.string().min(2, 'State is too short'),
  shippingZip: z.string().regex(/^\d{5}$/, 'Invalid ZIP code'),
});

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedCurrency } = useCurrency();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      shippingName: '',
      shippingPhone: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingZip: '',
    },
  });

   useEffect(() => {
    if (user) {
      // Set email from auth context
      form.setValue('email', user.email || '');

      // Fetch user profile to get name and address
      const fetchUserProfile = async () => {
        const userProfile = await getUserById(user.uid);
        if (userProfile) {
          form.setValue('shippingName', `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || user.displayName || '');
          if (userProfile.shippingAddress) {
            form.setValue('shippingAddress', userProfile.shippingAddress.address || '');
            form.setValue('shippingCity', userProfile.shippingAddress.city || '');
            form.setValue('shippingState', userProfile.shippingAddress.state || '');
            form.setValue('shippingZip', userProfile.shippingAddress.zip || '');
          }
        } else {
            form.setValue('shippingName', user.displayName || '');
        }
      };
      fetchUserProfile();
    }
  }, [user, form]);


  if (cart.length === 0) {
    // Redirect to home if cart is empty, but wait for client-side navigation
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to place an order.', variant: 'destructive'});
      return;
    }
    setIsSubmitting(true);
    try {
      await addOrder({
        userId: user.uid,
        customerName: values.shippingName,
        customerEmail: values.email,
        customerPhone: values.shippingPhone,
        total: cartTotal, // Store total in base currency (USD)
        status: 'Processing',
        items: cart,
        shippingAddress: {
          address: values.shippingAddress,
          city: values.shippingCity,
          state: values.shippingState,
          zip: values.shippingZip,
        }
      });

      toast({
        title: 'Order Placed!',
        description: 'Thank you for your purchase. We will contact you shortly for confirmation.',
      });
      clearCart();
      router.push('/account');

    } catch (error) {
      console.error("Failed to place order:", error);
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-headline text-4xl font-bold mb-8 text-center lg:text-left">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Card>
                <CardHeader><CardTitle className="font-headline text-2xl">Shipping & Contact Information</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="shippingName" render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input placeholder="you@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="shippingPhone" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="shippingAddress" render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input placeholder="123 Main St" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="shippingCity" render={({ field }) => (
                    <FormItem className="sm:col-span-2 md:col-span-1">
                      <FormLabel>City</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="shippingState" render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                   <FormField control={form.control} name="shippingZip" render={({ field }) => (
                    <FormItem>
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 border rounded-md bg-muted/50">
                    <p className="font-semibold">Cash on Delivery</p>
                    <p className="text-sm text-muted-foreground">You will pay for your order upon its arrival.</p>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Placing Order...' : `Confirm Order (Cash on Delivery)`}
              </Button>
            </form>
          </Form>
        </div>
        
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <Card>
            <CardHeader><CardTitle className="font-headline text-2xl">Your Order</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {cart.map(({ product, quantity }) => {
                const price = product.onSale && product.salePrice ? product.salePrice : product.price;
                return (
                  <div key={product.id} className="flex justify-between items-center text-sm">
                    <span className="font-medium">{product.name} <span className="text-muted-foreground">x {quantity}</span></span>
                    <span>{formatPrice(price * quantity, selectedCurrency)}</span>
                  </div>
                );
              })}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatPrice(cartTotal, selectedCurrency)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
