

'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getPagesContent, updatePagesContent } from '@/lib/services/pages-service';
import type { PagesContent } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

const pagesSchema = z.object({
    about: z.object({
        headline: z.string().min(5, 'Headline is required.'),
        subheading: z.string().min(10, 'Subheading is required.'),
        mission: z.string().min(20, 'Mission statement is required.'),
        vision: z.string().min(20, 'Vision statement is required.'),
        founderName: z.string().min(3, 'Founder name is required.'),
        founderTitle: z.string().min(3, 'Founder title is required.'),
        bannerImageUrl: z.string().url('Please enter a valid URL.'),
        founderImageUrl: z.string().url('Please enter a valid URL.'),
    }),
    contact: z.object({
        headline: z.string().min(5, 'Headline is required.'),
        subheading: z.string().min(10, 'Subheading is required.'),
        address: z.string().min(10, 'Address is required.'),
        phone: z.string().min(10, 'Phone number is required.'),
        email: z.string().email('Invalid email address.'),
    }),
});

type PagesFormValues = z.infer<typeof pagesSchema>;

export default function PagesSettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);

    const form = useForm<PagesFormValues>({
        resolver: zodResolver(pagesSchema),
        defaultValues: {
            about: {
                headline: '', subheading: '', mission: '', vision: '', founderName: '', founderTitle: '',
                bannerImageUrl: '', founderImageUrl: '',
            },
            contact: {
                headline: '', subheading: '', address: '', phone: '', email: ''
            }
        },
    });

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const content = await getPagesContent();
                form.reset(content);
            } catch (error) {
                console.error("Failed to fetch page content:", error);
                toast({ title: 'Error', description: 'Failed to load page content.', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [form, toast]);
    

    async function onSubmit(values: PagesFormValues) {
        try {
            await updatePagesContent(values);
            toast({
                title: 'Content Updated',
                description: `Page content has been successfully updated.`,
            });
            router.refresh();
        } catch (error) {
            console.error('Failed to update content:', error);
            toast({
                title: 'Error',
                description: 'Failed to update content. Please try again.',
                variant: 'destructive',
            });
        }
    }

    if (loading) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-10 w-1/3 mb-8" />
                <div className="space-y-8 max-w-4xl mx-auto">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Page Content</h1>
                <p className="text-muted-foreground">Manage the content for your static pages.</p>
            </header>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Us Page</CardTitle>
                            <CardDescription>Manage the content on the /about page.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="about.headline" render={({ field }) => (
                                <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="about.subheading" render={({ field }) => (
                                <FormItem><FormLabel>Subheading</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Separator />
                             <FormField control={form.control} name="about.bannerImageUrl" render={({ field }) => (
                                <FormItem><FormLabel>Banner Image URL</FormLabel><FormControl><Input placeholder="https://example.com/banner.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <Separator />
                            <FormField control={form.control} name="about.mission" render={({ field }) => (
                                <FormItem><FormLabel>Our Mission</FormLabel><FormControl><Textarea rows={4} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="about.vision" render={({ field }) => (
                                <FormItem><FormLabel>Our Vision</FormLabel><FormControl><Textarea rows={3} {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <Separator />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="about.founderName" render={({ field }) => (
                                    <FormItem><FormLabel>Founder Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="about.founderTitle" render={({ field }) => (
                                    <FormItem><FormLabel>Founder Title</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                             <FormField control={form.control} name="about.founderImageUrl" render={({ field }) => (
                                <FormItem><FormLabel>Founder Image URL</FormLabel><FormControl><Input placeholder="https://example.com/founder.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Us Page</CardTitle>
                            <CardDescription>Manage the content on the /contact page.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <FormField control={form.control} name="contact.headline" render={({ field }) => (
                                <FormItem><FormLabel>Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="contact.subheading" render={({ field }) => (
                                <FormItem><FormLabel>Subheading</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="contact.address" render={({ field }) => (
                                <FormItem><FormLabel>Office Address</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormMessage>
                            )} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="contact.phone" render={({ field }) => (
                                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="contact.email" render={({ field }) => (
                                    <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </CardContent>
                    </Card>

                    
                    <div className="flex justify-end gap-4">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save All Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
