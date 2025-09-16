
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
import { useCurrency } from '@/context/currency-context';
import { formatPrice } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';

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
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const { selectedCurrency } = useCurrency();

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
          // user from useAuth() now contains the merged data from Auth and Firestore
          const userProfile = user;
          const userOrders = await getOrdersByUserId(user.uid);
          
          setOrders(userOrders);
          setSiteUser(userProfile);

           // Initialize form with the complete user object from the auth context
           form.reset({
              firstName: userProfile?.firstName || '',
              lastName: userProfile?.lastName || '',
              email: userProfile.email || '',
              shippingAddress: userProfile?.shippingAddress?.address || '',
              shippingCity: userProfile?.shippingAddress?.city || '',
              shippingState: userProfile?.shippingAddress?.state || '',
              shippingZip: userProfile?.shippingAddress?.zip || '',
            });

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

        // Refetch site user to display updated data
        const updatedUser = await getUserById(user.uid);
        setSiteUser(updatedUser);

        toast({
            title: "Profile Updated",
            description: "Your account details have been saved.",
        });
        setIsEditing(false); // Exit edit mode
    } catch (error) {
        toast({
            title: "Update Failed",
            description: "Could not save your profile. Please try again.",
            variant: "destructive",
        });
    }
  }

  const formatDate = (date: any) => {
    if (!date) return '';
    // If it's a Firestore Timestamp, convert it
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PPP');
    }
    // If it's already a Date object
    if (date instanceof Date) {
      return format(date, 'PPP');
    }
    // If it's a string or number, try to parse it
    try {
      const parsedDate = new Date(date);
      // Check if the parsed date is valid
      if (!isNaN(parsedDate.getTime())) {
        return format(parsedDate, 'PPP');
      }
    } catch (e) {
      // Fallback for invalid date formats
      return 'Invalid Date';
    }
    // If all else fails, return the original value as a string
    return String(date);
  };


  if (authLoading || loading || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-headline text-4xl font-bold mb-8">My Account</h1>
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
                 <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        {[...Array(3)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            {[...Array(3)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
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
            {isEditing ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="font-headline">Edit Profile</CardTitle>
                                <CardDescription>Update your personal information.</CardDescription>
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
                            <CardFooter className="justify-end gap-2">
                                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Form>
            ) : (
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="font-headline">Profile</CardTitle>
                            <CardDescription>Your personal information.</CardDescription>
                        </div>
                        <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div>
                            <p className="font-medium text-muted-foreground">Name</p>
                            <p className="font-semibold">{(siteUser?.firstName || user.displayName)}</p>
                        </div>
                        <div>
                            <p className="font-medium text-muted-foreground">Email</p>
                            <p className="font-semibold">{user.email}</p>
                        </div>
                         <div>
                            <p className="font-medium text-muted-foreground">Shipping Address</p>
                            {siteUser?.shippingAddress?.address ? (
                                <p className="font-semibold">
                                    {siteUser.shippingAddress.address}, <br/>
                                    {siteUser.shippingAddress.city}, {siteUser.shippingAddress.state} {siteUser.shippingAddress.zip}
                                </p>
                            ) : (
                                <p className="text-muted-foreground">No address set.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}
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
                      <TableHead className="text-end">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                  order.status === 'Delivered' ? 'default' : 
                                  order.status === 'Processing' ? 'secondary' : 
                                  order.status === 'Cancelled' ? 'destructive' : 'outline'
                              }
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-end">{formatPrice(order.total, selectedCurrency)}</TableCell>
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
