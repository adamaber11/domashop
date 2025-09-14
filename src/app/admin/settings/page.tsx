
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getSiteSettings, updateSiteSettings } from '@/lib/services/settings-service';
import type { SiteSettings } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Trash2 } from 'lucide-react';

const settingsSchema = z.object({
    welcomeHeadline: z.string().min(5, 'Headline must be at least 5 characters.'),
    welcomeSubheading: z.string().min(10, 'Subheading must be at least 10 characters.'),
    logoTextPrimary: z.string().min(1, 'Primary logo text is required.'),
    logoTextSecondary: z.string().min(1, 'Secondary logo text is required.'),
    socials: z.object({
        facebook: z.string().min(1, 'Facebook URL is required.'),
        twitter: z.string().min(1, 'Twitter URL is required.'),
        instagram: z.string().min(1, 'Instagram URL is required.'),
        linkedin: z.string().min(1, 'LinkedIn URL is required.'),
    }),
    heroImages: z.array(z.object({
        src: z.string().min(1, 'Image URL is required.'),
        alt: z.string().min(1, 'Image alt text is required.'),
        hint: z.string().min(1, 'Image hint is required.'),
    })).min(1, 'At least one hero image is required.'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            welcomeHeadline: '',
            welcomeSubheading: '',
            logoTextPrimary: 'Do',
            logoTextSecondary: 'ma',
            socials: {
                facebook: '#',
                twitter: '#',
                instagram: '#',
                linkedin: '#',
            },
            heroImages: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "heroImages"
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const fetchedSettings = await getSiteSettings();
                setSettings(fetchedSettings);
                form.reset(fetchedSettings);
            } catch (error) {
                console.error("Failed to fetch site settings:", error);
                toast({ title: 'Error', description: 'Failed to load site settings.', variant: 'destructive' });
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [form, toast]);
    

    async function onSubmit(values: SettingsFormValues) {
        if (!settings) return;
        try {
            await updateSiteSettings(values);
            toast({
                title: 'Settings Updated',
                description: `Site settings have been successfully updated.`,
            });
            router.refresh();
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to update settings. Please try again.',
                variant: 'destructive',
            });
        }
    }

    if (loading) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-10 w-1/3 mb-8" />
                <div className="space-y-8 max-w-4xl mx-auto">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Site Settings</h1>
                <p className="text-muted-foreground">Manage global content and settings for your website.</p>
            </header>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle>Homepage Content</CardTitle>
                            <CardDescription>Manage the main welcome message on the homepage.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="welcomeHeadline" render={({ field }) => (
                                <FormItem><FormLabel>Welcome Headline</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="welcomeSubheading" render={({ field }) => (
                                <FormItem><FormLabel>Welcome Subheading</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Site Logo</CardTitle>
                            <CardDescription>Manage the text-based logo.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="logoTextPrimary" render={({ field }) => (
                                <FormItem><FormLabel>Logo Primary Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="logoTextSecondary" render={({ field }) => (
                                <FormItem><FormLabel>Logo Secondary (Accent) Text</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Footer Social Links</CardTitle>
                            <CardDescription>Enter the full URLs for your social media profiles.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="socials.facebook" render={({ field }) => (
                                <FormItem><FormLabel>Facebook URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="socials.twitter" render={({ field }) => (
                                <FormItem><FormLabel>Twitter URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                             <FormField control={form.control} name="socials.instagram" render={({ field }) => (
                                <FormItem><FormLabel>Instagram URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="socials.linkedin" render={({ field }) => (
                                <FormItem><FormLabel>LinkedIn URL</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Homepage Hero Carousel</CardTitle>
                            <CardDescription>Manage the images displayed in the main banner.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                                    <h4 className="font-medium">Image {index + 1}</h4>
                                     <FormField control={form.control} name={`heroImages.${index}.src`} render={({ field }) => (
                                        <FormItem><FormLabel>Image URL</FormLabel><FormControl><Input placeholder="https://example.com/image.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name={`heroImages.${index}.alt`} render={({ field }) => (
                                        <FormItem><FormLabel>Alt Text</FormLabel><FormControl><Input placeholder="Describe the image" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                     <FormField control={form.control} name={`heroImages.${index}.hint`} render={({ field }) => (
                                        <FormItem><FormLabel>AI Hint</FormLabel><FormControl><Input placeholder="e.g. 'city skyline'" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => remove(index)}>
                                        <Trash2 className="h-4 w-4"/>
                                        <span className="sr-only">Remove Image</span>
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => append({ src: '', alt: '', hint: ''})}>
                                Add Image
                            </Button>
                        </CardContent>
                    </Card>
                    
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
