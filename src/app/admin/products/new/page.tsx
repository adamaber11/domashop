
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { addProduct } from '@/lib/services/product-service';
import { allCategories } from '@/lib/data';
import { Separator } from '@/components/ui/separator';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be a negative number.'),
  category: z.string().min(1, 'Please select a category.'),
  onSale: z.boolean().default(false),
  salePrice: z.coerce.number().optional(),
  isFeatured: z.boolean().default(false),
  imageUrls: z.array(z.string().url("Please enter a valid URL.")).min(1, 'At least one image URL is required.'),
  imageHint: z.string().min(2, 'Image hint is required.'),
}).refine(data => {
    if (data.onSale && (!data.salePrice || data.salePrice <= 0)) {
        return false;
    }
    return true;
}, {
    message: 'Sale price must be a positive number when product is on sale.',
    path: ['salePrice'],
});

type ProductFormValues = z.infer<typeof productSchema>;

const generateProductId = () => `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

export default function NewProductPage() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 10,
            category: '',
            onSale: false,
            salePrice: undefined,
            isFeatured: false,
            imageUrls: ['', '', ''],
            imageHint: '',
        },
    });

    async function onSubmit(values: ProductFormValues) {
        try {
            const newProductId = generateProductId();
             // Filter out empty strings from imageUrls
            const finalImageUrls = values.imageUrls.filter(url => url.trim() !== '');

            if (finalImageUrls.length === 0) {
                 toast({
                    title: 'Image Required',
                    description: 'Please provide at least one image URL for the product.',
                    variant: 'destructive',
                });
                return;
            }

            const productData = {
                ...values,
                imageUrls: finalImageUrls,
            };

            await addProduct(productData, newProductId);
            toast({
                title: 'Product Created',
                description: `Product "${values.name}" has been successfully created.`,
            });
            router.push('/admin/products');
        } catch (error) {
            console.error('Failed to create product:', error);
            toast({
                title: 'Error',
                description: 'Failed to create product. Please try again.',
                variant: 'destructive',
            });
        }
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Add New Product</h1>
                <p className="text-muted-foreground">Fill out the form to add a new product to your store.</p>
            </header>
            
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem><FormLabel>Product Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    
                    <FormField control={form.control} name="description" render={({ field }) => (
                        <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea rows={5} {...field} /></FormControl><FormMessage /></FormItem>
                    )} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <FormField control={form.control} name="price" render={({ field }) => (
                            <FormItem><FormLabel>Price (USD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="stock" render={({ field }) => (
                            <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                     <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger>
                                    <SelectValue placeholder={"Select a category"} />
                                </SelectTrigger></FormControl>
                                <SelectContent>
                                    {allCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    
                    <Separator />
                    
                     <div className="space-y-4">
                        <h3 className="text-lg font-medium">Product Images</h3>
                         <FormDescription>Upload your images to a service like <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline">Imgur</a> and paste the direct image links below.</FormDescription>
                        <FormField control={form.control} name="imageUrls.0" render={({ field }) => (
                            <FormItem><FormLabel>Image URL 1 (Main)</FormLabel><FormControl><Input placeholder="https://i.imgur.com/your-image.jpeg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="imageUrls.1" render={({ field }) => (
                            <FormItem><FormLabel>Image URL 2</FormLabel><FormControl><Input placeholder="https://i.imgur.com/your-image.jpeg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="imageUrls.2" render={({ field }) => (
                            <FormItem><FormLabel>Image URL 3</FormLabel><FormControl><Input placeholder="https://i.imgur.com/your-image.jpeg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                         <FormField control={form.control} name="imageHint" render={({ field }) => (
                            <FormItem>
                                <FormLabel>AI Image Hint</FormLabel>
                                <FormControl><Input placeholder="e.g., 'vintage camera'" {...field} /></FormControl>
                                <FormDescription>A short description (1-2 words) for AI image replacement suggestions.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <FormField control={form.control} name="onSale" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none"><FormLabel>Product is on sale</FormLabel></div>
                            </FormItem>
                        )} />
                        {form.watch('onSale') && (
                             <FormField control={form.control} name="salePrice" render={({ field }) => (
                                <FormItem><FormLabel>Sale Price (USD)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                        )}
                    </div>
                     <FormField control={form.control} name="isFeatured" render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Featured Product</FormLabel>
                                <FormDescription>Featured products appear on the homepage.</FormDescription>
                            </div>
                        </FormItem>
                    )} />
                    
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Creating...' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

    