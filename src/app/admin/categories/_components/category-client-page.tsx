
'use client';

import { useState } from 'react';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRight, PlusCircle, Trash2, Edit, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { CategoryForm } from './category-form';
import { deleteCategory } from '@/lib/services/category-service';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface CategoryClientPageProps {
  initialCategories: Category[];
  seedAction: () => Promise<{ success: boolean, message: string }>;
}

export function CategoryClientPage({ initialCategories, seedAction }: CategoryClientPageProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const handleCategorySaved = (savedCategory: Category) => {
    // This is a simplified update. A more robust solution might refetch the whole tree.
    const updateRecursively = (cats: Category[]): Category[] => {
      return cats.map(c => {
        if (c.id === savedCategory.id) return { ...c, ...savedCategory };
        if (c.id === savedCategory.parentId) return { ...c, subcategories: [...c.subcategories, savedCategory] };
        return { ...c, subcategories: updateRecursively(c.subcategories) };
      });
    };

    if (savedCategory.parentId) {
      setCategories(updateRecursively(categories));
    } else {
      const existing = categories.find(c => c.id === savedCategory.id);
      if (existing) {
        setCategories(categories.map(c => c.id === savedCategory.id ? { ...c, ...savedCategory } : c));
      } else {
        setCategories([...categories, savedCategory]);
      }
    }
    setEditingCategory(null);
  };
  
  const handleSeed = async () => {
      setIsSeeding(true);
      const result = await seedAction();
       toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
      });
      // A full page refresh is the easiest way to show the new categories
      if (result.success) window.location.reload();
      setIsSeeding(false);
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
        await deleteCategory(categoryToDelete.id);

        const removeRecursively = (cats: Category[], id: string): Category[] => {
            return cats.filter(c => c.id !== id).map(c => ({
                ...c,
                subcategories: removeRecursively(c.subcategories, id)
            }));
        };

        setCategories(removeRecursively(categories, categoryToDelete.id));
        toast({ title: 'Category Deleted', description: `"${categoryToDelete.name}" was deleted.`});
    } catch (error: any) {
         toast({ title: 'Error Deleting', description: error.message, variant: 'destructive'});
    } finally {
        setCategoryToDelete(null);
    }
  }

  const renderCategory = (category: Category, level = 0) => (
    <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
      <Collapsible defaultOpen>
        <div className="flex items-center gap-2 p-2 my-1 rounded-md border bg-muted/50">
          {category.subcategories.length > 0 && (
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4 transition-transform data-[state=open]:rotate-90" />
              </Button>
            </CollapsibleTrigger>
          )}
           {category.subcategories.length === 0 && <div className="w-8 h-8"/>}
          <span className="font-medium flex-grow">{category.name}</span>
          <Button variant="ghost" size="sm" onClick={() => setEditingCategory({ parentId: category.id, subcategories: [] })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Sub
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setCategoryToDelete(category)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <CollapsibleContent className="CollapsibleContent">
          {category.subcategories.map(sub => renderCategory(sub, level + 1))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );

  return (
    <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <Card>
            <CardContent className="p-4">
                {categories.length > 0 ? (
                    categories.map(cat => renderCategory(cat))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground mb-4">No categories found. You can add them one by one, or seed initial categories.</p>
                         <Button onClick={handleSeed} disabled={isSeeding}>
                            {isSeeding ? 'Seeding...' : 'Seed Initial Categories'}
                        </Button>
                    </div>
                )}
            </CardContent>
            </Card>
        </div>

        <div>
            <Card>
                <CardContent className="p-4">
                     <Button className="w-full mb-4" onClick={() => setEditingCategory({ parentId: null, subcategories: [] })}>
                        <PlusCircle className="mr-2 h-5 w-5" /> Add Main Category
                    </Button>
                    {editingCategory ? (
                        <CategoryForm
                            category={editingCategory}
                            onSave={handleCategorySaved}
                            onCancel={() => setEditingCategory(null)}
                        />
                    ) : (
                        <p className="text-center text-sm text-muted-foreground p-4">Select a category to edit or add a new one.</p>
                    )}
                </CardContent>
            </Card>
        </div>
        
         <AlertDialog open={!!categoryToDelete} onOpenChange={() => setCategoryToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2"><AlertTriangle className="text-destructive h-6 w-6"/>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the category "{categoryToDelete?.name}".
                        If this category has subcategories, they will be deleted too. 
                        Products in this category will NOT be deleted but will need to be reassigned to a new category.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete Category</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
