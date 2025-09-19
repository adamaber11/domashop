
'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, query, where, orderBy, writeBatch } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { unstable_cache as cache, revalidatePath } from 'next/cache';
import { initialCategories } from '@/lib/data';

const categoriesCollection = collection(db, 'categories');

function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export const getCategoriesHierarchy = cache(async (): Promise<Category[]> => {
  try {
    const q = query(categoriesCollection, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const allCategories = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Omit<Category, 'subcategories'> & { subcategories?: Category[] }));

    const categoryMap = new Map(allCategories.map(c => [c.id, { ...c, subcategories: [] }]));
    const rootCategories: Category[] = [];

    allCategories.forEach(cat => {
      if (cat.parentId && categoryMap.has(cat.parentId)) {
        categoryMap.get(cat.parentId)!.subcategories.push(categoryMap.get(cat.id)!);
      } else {
        rootCategories.push(categoryMap.get(cat.id)!);
      }
    });

    return rootCategories;
  } catch (error) {
    console.error("Error fetching category hierarchy:", error);
    throw new Error('Failed to fetch categories.');
  }
}, ['categories-hierarchy'], { revalidate: 30 });


export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
    try {
        const q = query(categoriesCollection, where('slug', '==', slug), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }
        
        const categoryDoc = querySnapshot.docs[0];
        const categoryData = { id: categoryDoc.id, ...categoryDoc.data() } as Category;

        // Fetch subcategories
        const subcategoriesQuery = query(categoriesCollection, where('parentId', '==', categoryData.id), orderBy('name'));
        const subcategoriesSnapshot = await getDocs(subcategoriesQuery);
        categoryData.subcategories = subcategoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));

        return categoryData;
    } catch (error) {
        console.error(`Error fetching category by slug ${slug}:`, error);
        throw new Error('Failed to fetch category data.');
    }
}, ['category-by-slug'], { revalidate: 30 });


export async function addCategory(name: string, parentId: string | null): Promise<Category> {
  try {
    const slug = createSlug(name);
    const docRef = await addDoc(categoriesCollection, {
      name,
      slug,
      parentId,
    });
    revalidatePath('/admin/categories');
    return { id: docRef.id, name, slug, parentId, subcategories: [] };
  } catch (error) {
    console.error("Error adding category:", error);
    throw new Error('Failed to add category.');
  }
}

export async function updateCategory(id: string, name: string): Promise<Partial<Category>> {
  try {
    const slug = createSlug(name);
    const docRef = doc(db, 'categories', id);
    await updateDoc(docRef, { name, slug });
    revalidatePath('/admin/categories');
    return { id, name, slug };
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    throw new Error('Failed to update category.');
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const batch = writeBatch(db);
  const docRef = doc(db, 'categories', id);
  
  // Find and delete all children recursively to avoid orphaned categories
  const childrenQuery = query(categoriesCollection, where('parentId', '==', id));
  const childrenSnapshot = await getDocs(childrenQuery);
  if (!childrenSnapshot.empty) {
    throw new Error("Cannot delete a category that has subcategories. Please delete the subcategories first.");
  }

  batch.delete(docRef);
  await batch.commit();
  revalidatePath('/admin/categories');
}

export async function seedInitialCategories(): Promise<{ success: boolean; message: string; }> {
    try {
        const snapshot = await getDocs(query(categoriesCollection, limit(1)));
        if (!snapshot.empty) {
            return { success: false, message: "Categories collection is not empty. Seeding aborted." };
        }

        const batch = writeBatch(db);

        for (const mainCat of initialCategories) {
            const mainCatRef = doc(collection(db, 'categories'));
            batch.set(mainCatRef, {
                name: mainCat.name,
                slug: mainCat.slug,
                parentId: null
            });

            for (const subCat of mainCat.subcategories) {
                const subCatRef = doc(collection(db, 'categories'));
                batch.set(subCatRef, {
                    name: subCat.name,
                    slug: subCat.slug,
                    parentId: mainCatRef.id
                });
            }
        }
        await batch.commit();
        revalidatePath('/admin/categories');
        return { success: true, message: "Initial categories seeded successfully." };
    } catch (error) {
        console.error("Error seeding categories:", error);
        return { success: false, message: "An error occurred while seeding." };
    }
}
