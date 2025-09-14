'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from '@/components/ui/skeleton';
import { getOrdersByUserId } from '@/lib/services/order-service';
import { getUserById, updateUserProfile } from '@/lib/services/user-service';
import type { Order, SiteUser, ShippingAddress } from '@/lib/types';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email(),
  shippingAddress: z.string().min(5, "Address is too short."),
  shippingCity: z.string().min(2, "City is too short."),
  shippingState: z.string().min(2, "State is too short."),
  shippingZip: z.string().regex(/^\d{5}$/, "Invalid ZIP code."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function AccountPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [siteUser, setSiteUser] = useState<SiteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      shippingAddress: '',
      shippingCity: '',
      shippingState: '',
      shippingZip: '',
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        setLoading(true);
        try {
          const [userOrders, userProfile] = await Promise.all([
            getOrdersByUserId(user.uid),
            getUserById(user.uid)
          ]);
          setOrders(userOrders);
          setSiteUser(userProfile);

          if (userProfile) {
            form.reset({
              firstName: userProfile.firstName || '',
              lastName: userProfile.lastName || '',
              email: user.email || '',
              shippingAddress: userProfile.shippingAddress?.address || '',
              shippingCity: userProfile.shippingAddress?.city || '',
              shippingState: userProfile.shippingAddress?.state || '',
              shippingZip: userProfile.shippingAddress?.zip || '',
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          toast({ title: 'Error', description: 'Could not load your account data.', variant: 'destructive' });
        } finally {
          setLoading(false);
        }
      };
      fetchUserData();
    }
  }, [user, form, toast]);

  async function onSubmit(values: ProfileFormValues) {
    if (!user) return;
    try {
        const shippingAddress: ShippingAddress = {
            address: values.shippingAddress,
            city: values.shippingCity,
            state: values.shippingState,
            zip: values.shippingZip,
        };

        await updateUserProfile(user.uid, {
            firstName: values.firstName,
            lastName: values.lastName,
            shippingAddress: shippingAddress,
        });

        toast({
            title: "Profile Updated",
            description: "Your account details have been saved.",
        });
    } catch (error) {
        toast({
            title: "Update Failed",
            description: "Could not save your profile. Please try again.",
            variant: "destructive",
        });
    }
  }

  if (authLoading || loading || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Skeleton className="h-12 w-1/4 mb-8" />
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-5 w-1/4" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {[...Array(4)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(3)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(4)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-headline text-4xl font-bold mb-8">My Account</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Profile</CardTitle>
                            <CardDescription>Manage your personal information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="firstName" render={({ field }) => (
                                    <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="lastName" render={({ field }) => (
                                    <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} readOnly disabled /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="shippingAddress" render={({ field }) => (
                                <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="shippingCity" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="shippingState" render={({ field }) => (
                                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="shippingZip" render={({ field }) => (
                                    <FormItem><FormLabel>ZIP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </div>

        <div className="md:col-span-2">
           <Card>
            <CardHeader>
              <CardTitle className="font-headline">Order History</CardTitle>
              <CardDescription>View your past orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                          <TableCell>{format(order.date.toDate(), 'PPP')}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>{order.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          You haven't placed any orders yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
