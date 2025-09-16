
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Skeleton } from '@/components/ui/skeleton';
import { getUserById, updateUserProfile } from '@/lib/services/user-service';
import type { SiteUser, ShippingAddress } from '@/lib/types';
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
  const [siteUser, setSiteUser] = useState<SiteUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
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
          // user from useAuth() now contains the merged data from Auth and Firestore
          const userProfile = user;
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

  if (authLoading || loading || !user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-headline text-4xl font-bold mb-8">My Account</h1>
        <div className="flex justify-center">
            <Card className="w-full max-w-lg">
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
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-headline text-4xl font-bold mb-8 text-center">My Account</h1>
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
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
                            <p className="font-semibold">{siteUser?.firstName || user.displayName}</p>
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
      </div>
    </div>
  )
}
