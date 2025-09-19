
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getProductById, updateProduct } from '@/lib/services/product-service';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useCategories } from '@/hooks/use-categories';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be a negative number.'),
  category: z.string().min(1, 'Please select a category.'),
  onSale: z.boolean().default(false),
  salePrice: z.coerce.number().optional(),
  isFeatured: z.boolean().default(false),
  imageUrl1: z.string().min(1, 'Please enter a URL for Image 1.'),
  imageUrl2: z.string().min(1, 'Please enter a URL for Image 2.'),
  imageUrl3: z.string().min(1, 'Please enter a URL for Image 3.'),
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

export default function EditProductPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { toast } = useToast();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const { flatCategories, loading: categoriesLoading } = useCategories();


    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            category: '',
            onSale: false,
            salePrice: undefined,
            isFeatured: false,
            imageUrl1: '',
            imageUrl2: '',
            imageUrl3: '',
            imageHint: '',
        },
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const fetchedProduct = await getProductById(params.id);
                if (fetchedProduct) {
                    setProduct(fetchedProduct);
                    form.reset({
                        name: fetchedProduct.name,
                        description: fetchedProduct.description,
                        price: fetchedProduct.price,
                        stock: fetchedProduct.stock,
                        category: fetchedProduct.category,
                        onSale: fetchedProduct.onSale || false,
                        salePrice: fetchedProduct.salePrice,
                        isFeatured: fetchedProduct.isFeatured || false,
                        imageUrl1: fetchedProduct.imageUrls[0] || '',
                        imageUrl2: fetchedProduct.imageUrls[1] || '',
                        imageUrl3: fetchedProduct.imageUrls[2] || '',
                        imageHint: fetchedProduct.imageHint,
                    });
                } else {
                    notFound();
                }
            } catch (error) {
                console.error("Failed to fetch product for editing:", error);
                toast({ title: 'Error', description: 'Failed to load product data.', variant: 'destructive' });
                notFound();
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id, form, toast]);
    

    async function onSubmit(values: ProductFormValues) {
        if (!product) return;
        try {
            const productData = {
                name: values.name,
                description: values.description,
                price: values.price,
                stock: values.stock,
                category: values.category,
                onSale: values.onSale,
                salePrice: values.salePrice,
                isFeatured: values.isFeatured,
                imageUrls: [values.imageUrl1, values.imageUrl2, values.imageUrl3],
                imageHint: values.imageHint,
            };
            await updateProduct(product.id, productData);
            toast({
                title: 'Product Updated',
                description: `Product "${values.name}" has been successfully updated.`,
            });
            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            console.error('Failed to update product:', error);
            toast({
                title: 'Error',
                description: 'Failed to update product. Please try again.',
                variant: 'destructive',
            });
        }
    }

    if (loading) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Skeleton className="h-10 w-1/3 mb-8" />
                <div className="space-y-8 max-w-4xl mx-auto">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <div className="grid grid-cols-2 gap-8">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <Skeleton className="h-12 w-full" />
                     <Skeleton className="h-48 w-full" />
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Edit Product</h1>
                <p className="text-muted-foreground">Update the details for "{product?.name}".</p>
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
                            <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="stock" render={({ field }) => (
                            <FormItem><FormLabel>Stock Quantity</FormLabel><FormControl><Input type="number" step="1" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                    <FormField control={form.control} name="category" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value} disabled={categoriesLoading}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select a category"} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {flatCategories.map(cat => <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />


                    <div className="space-y-4">
                        <FormField control={form.control} name="onSale" render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                <div className="space-y-1 leading-none"><FormLabel>Product is on sale</FormLabel></div>
                            </FormItem>
                        )} />
                        {form.watch('onSale') && (
                             <FormField control={form.control} name="salePrice" render={({ field }) => (
                                <FormItem><FormLabel>Sale Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
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

                     <div className="space-y-4 rounded-md border p-4">
                         <FormLabel>Product Images</FormLabel>
                         <FormDescription>Enter exactly 3 public image URLs.</FormDescription>
                        <FormField control={form.control} name="imageUrl1" render={({ field }) => (
                            <FormItem><FormLabel>Image URL 1</FormLabel><FormControl><Input placeholder="https://example.com/image1.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="imageUrl2" render={({ field }) => (
                            <FormItem><FormLabel>Image URL 2</FormLabel><FormControl><Input placeholder="https://example.com/image2.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="imageUrl3" render={({ field }) => (
                            <FormItem><FormLabel>Image URL 3</FormLabel><FormControl><Input placeholder="https://example.com/image3.jpg" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                    </div>

                     <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Image AI Hint</FormLabel>
                                <FormControl><Input {...field} placeholder="e.g., 'vintage camera'" /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
