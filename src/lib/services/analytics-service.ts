'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import type { Product, Order } from '@/lib/types';
import { unstable_cache as cache } from 'next/cache';

export const getSalesOverTime = cache(async (): Promise<{ month: Date; totalSales: number }[]> => {
  try {
    const ordersSnapshot = await getDocs(query(collection(db, 'orders'), orderBy('date', 'desc')));
    const orders = ordersSnapshot.docs.map(doc => doc.data() as Order);
    
    const salesByMonth: { [key: string]: number } = {};

    orders.forEach(order => {
      if (order.status === 'Delivered' || order.status === 'Shipped') {
        const orderDate = (order.date as Timestamp).toDate();
        const month = new Date(orderDate.getFullYear(), orderDate.getMonth(), 1);
        const monthKey = month.toISOString();

        if (!salesByMonth[monthKey]) {
          salesByMonth[monthKey] = 0;
        }
        salesByMonth[monthKey] += order.total;
      }
    });

    const sortedMonths = Object.keys(salesByMonth).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    if (sortedMonths.length === 0) {
       const now = new Date();
       const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
       return [{ month: currentMonth, totalSales: 0 }];
    }

    return sortedMonths.map(monthKey => ({
      month: new Date(monthKey),
      totalSales: salesByMonth[monthKey],
    }));

  } catch (error) {
    console.error("Error fetching sales data:", error);
    // Return a default value in case of error to avoid crashing the page
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return [{ month: currentMonth, totalSales: 0 }];
  }
}, ['sales-over-time'], { revalidate: 60 });


export const getCategoryDistribution = cache(async (): Promise<{ category: string; count: number }[]> => {
  try {
    const productsSnapshot = await getDocs(collection(db, 'products'));
    const products = productsSnapshot.docs.map(doc => doc.data() as Product);

    const categoryCounts: { [key: string]: number } = {};
    products.forEach(product => {
      if (!categoryCounts[product.category]) {
        categoryCounts[product.category] = 0;
      }
      categoryCounts[product.category]++;
    });

    return Object.entries(categoryCounts)
        .map(([category, count]) => ({ category, count }))
        .sort((a,b) => b.count - a.count);

  } catch (error) {
    console.error("Error fetching category distribution:", error);
    throw new Error('Failed to fetch category distribution.');
  }
}, ['category-distribution'], { revalidate: 60 });


export const getTopPerformingProducts = cache(async (count: number): Promise<Product[]> => {
    try {
        const q = query(collection(db, 'products'), orderBy('reviewCount', 'desc'), orderBy('averageRating', 'desc'), limit(count));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error("Error fetching top performing products:", error);
        // Firestore requires a composite index for this query. If it fails, fallback to a simpler query.
        try {
            console.log('Fallback: Querying by averageRating only.');
            const fallbackQuery = query(collection(db, 'products'), orderBy('averageRating', 'desc'), limit(count));
            const fallbackSnapshot = await getDocs(fallbackQuery);
            return fallbackSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        } catch (fallbackError) {
             console.error("Error fetching top performing products with fallback:", fallbackError);
             throw new Error('Failed to fetch top products.');
        }
    }
}, ['top-products'], { revalidate: 60 });
