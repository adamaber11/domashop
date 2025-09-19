
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addCategory, updateCategory } from '@/lib/services/category-service';
import { useEffect } from 'react';

const formSchema = z.object({
  name: z.string().min(2, 'Category name is required.'),
});

interface CategoryFormProps {
  category: Partial<Category>;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

export function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: category.name || '' },
  });

  useEffect(() => {
    form.reset({ name: category.name || '' });
  }, [category, form]);

  const isEditing = !!category.id;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let savedCategory;
      if (isEditing) {
        savedCategory = await updateCategory(category.id!, values.name);
      } else {
        savedCategory = await addCategory(values.name, category.parentId || null);
      }
      toast({ title: 'Success', description: `Category "${savedCategory.name}" saved.` });
      onSave(savedCategory);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  }

  return (
    <Card className="bg-muted/30">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="text-lg font-headline">
              {isEditing ? `Edit "${category.name}"` : category.parentId ? 'Add Subcategory' : 'Add Main Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
