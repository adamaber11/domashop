
'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
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
    logoTextPart1: z.string().min(1, 'Logo Part 1 is required.'),
    logoTextPart2: z.string().min(1, 'Logo Part 2 is required.'),
    logoTextPart3: z.string().min(1, 'Logo Part 3 is required.'),
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
    heroCarouselDelay: z.coerce.number().min(500, 'Delay must be at least 500ms.'),
    currencies: z.array(z.object({
        code: z.string().min(3, 'Code must be 3 characters.').max(3, 'Code must be 3 characters.'),
        name: z.string().min(3, 'Name is required.'),
        rate: z.coerce.number().positive('Exchange rate must be positive.'),
    })).min(1, 'At least one currency is required.'),
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
            logoTextPart1: 'Do',
            logoTextPart2: 'm',
            logoTextPart3: 'a',
            socials: {
                facebook: '#',
                twitter: '#',
                instagram: '#',
                linkedin: '#',
            },
            heroImages: [],
            heroCarouselDelay: 2000,
            currencies: [],
        },
    });

    const { fields: heroImageFields, append: appendHeroImage, remove: removeHeroImage } = useFieldArray({
        control: form.control,
        name: "heroImages"
    });

    const { fields: currencyFields, append: appendCurrency, remove: removeCurrency } = useFieldArray({
        control: form.control,
        name: "currencies"
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
                            <CardDescription>Manage the text-based logo. The middle part will be accent-colored.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="logoTextPart1" render={({ field }) => (
                                <FormItem><FormLabel>Logo Part 1 (Black)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="logoTextPart2" render={({ field }) => (
                                <FormItem><FormLabel>Logo Part 2 (Orange)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                            <FormField control={form.control} name="logoTextPart3" render={({ field }) => (
                                <FormItem><FormLabel>Logo Part 3 (Black)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Currency Management</CardTitle>
                            <CardDescription>Manage currencies and their exchange rates against USD.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {currencyFields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-md space-y-3 relative">
                                    <h4 className="font-medium">Currency {index + 1}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <FormField control={form.control} name={`currencies.${index}.code`} render={({ field }) => (
                                            <FormItem><FormLabel>Code</FormLabel><FormControl><Input placeholder="e.g., EGP" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`currencies.${index}.name`} render={({ field }) => (
                                            <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Egyptian Pound" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name={`currencies.${index}.rate`} render={({ field }) => (
                                            <FormItem><FormLabel>Rate (vs USD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeCurrency(index)}>
                                        <Trash2 className="h-4 w-4"/>
                                        <span className="sr-only">Remove Currency</span>
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => appendCurrency({ code: '', name: '', rate: 1 })}>
                                Add Currency
                            </Button>
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
                            <CardDescription>Manage the images and settings for the main banner.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={form.control} name="heroCarouselDelay" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Autoplay Delay (in milliseconds)</FormLabel>
                                    <FormControl><Input type="number" {...field} /></FormControl>
                                    <FormDescription>Time each slide is shown before switching. e.g., 4000 for 4 seconds.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <Separator />

                            {heroImageFields.map((field, index) => (
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
                                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => removeHeroImage(index)}>
                                        <Trash2 className="h-4 w-4"/>
                                        <span className="sr-only">Remove Image</span>
                                    </Button>
                                </div>
                            ))}
                            <Button type="button" variant="outline" onClick={() => appendHeroImage({ src: '', alt: '', hint: ''})}>
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
