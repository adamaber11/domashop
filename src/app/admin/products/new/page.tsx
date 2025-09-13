'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/lib/data';
import { addProduct } from '@/lib/services/product-service';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters.'),
  description: z.string().min(10, 'Description must be at least 10 characters.'),
  price: z.coerce.number().positive('Price must be a positive number.'),
  category: z.string().min(1, 'Please select a category.'),
  onSale: z.boolean().default(false),
  salePrice: z.coerce.number().optional(),
  imageIds: z.array(z.string()).min(1, 'Please select at least one image.'),
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

export default function NewProductPage() {
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            category: '',
            onSale: false,
            salePrice: undefined,
            imageIds: [],
            imageHint: '',
        },
    });

    async function onSubmit(values: z.infer<typeof productSchema>) {
        try {
            await addProduct(values);
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
                            <FormItem><FormLabel>Price</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>
                        )} />
                        <FormField control={form.control} name="category" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger></FormControl>
                                    <SelectContent>
                                        {categories.filter(c => c !== "All").map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>

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

                    <FormField
                        control={form.control}
                        name="imageIds"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Product Images</FormLabel>
                                </div>
                                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 max-h-96 overflow-y-auto border p-4 rounded-md">
                                {PlaceHolderImages.map((image) => (
                                    <FormField
                                        key={image.id}
                                        control={form.control}
                                        name="imageIds"
                                        render={({ field }) => {
                                            return (
                                            <FormItem key={image.id} className="flex flex-col items-center space-y-2">
                                                <img src={image.imageUrl} alt={image.description} className="w-24 h-24 object-cover rounded-md" />
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(image.id)}
                                                        onCheckedChange={(checked) => {
                                                        return checked
                                                            ? field.onChange([...(field.value || []), image.id])
                                                            : field.onChange(
                                                                field.value?.filter(
                                                                    (value) => value !== image.id
                                                                )
                                                                )
                                                        }}
                                                    />
                                                </FormControl>
                                            </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    
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
