'use server';

import { getCategoriesHierarchy, seedInitialCategories } from '@/lib/services/category-service';
import { CategoryClientPage } from './_components/category-client-page';
import type { Category } from '@/lib/types';


export default async function AdminCategoriesPage() {
    const categories: Category[] = await getCategoriesHierarchy();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Categories</h1>
                <p className="text-muted-foreground">Manage your store's product categories.</p>
            </header>

            <CategoryClientPage initialCategories={categories} seedAction={seedInitialCategories} />
        </div>
    );
}
