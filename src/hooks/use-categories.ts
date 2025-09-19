
'use client';

import { useState, useEffect, useMemo } from 'react';
import type { Category } from '@/lib/types';
import { getCategoriesHierarchy } from '@/lib/services/category-service';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const fetchedCategories = await getCategoriesHierarchy();
        setCategories(fetchedCategories);
      } catch (err) {
        setError('Failed to load categories.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const flatCategories = useMemo(() => {
    const flatten = (cats: Category[]): Omit<Category, 'subcategories'>[] => {
      let flatList: Omit<Category, 'subcategories'>[] = [];
      for (const cat of cats) {
        const { subcategories, ...catData } = cat;
        flatList.push(catData);
        if (subcategories && subcategories.length > 0) {
          flatList = flatList.concat(flatten(subcategories));
        }
      }
      return flatList;
    };
    return flatten(categories);
  }, [categories]);

  return { categories, loading, error, flatCategories };
}
