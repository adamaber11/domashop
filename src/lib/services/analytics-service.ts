'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import type { Product, Order } from '@/lib/types';

// Mock data for sales - in a real app, this would come from your 'orders' collection
const mockOrders: Order[] = [
  { id: 'ORD001', customerName: 'Olivia Martin', customerEmail: 'olivia.m@example.com', total: 250.0, status: 'Delivered', date: '2024-05-20T10:30:00Z' },
  { id: 'ORD002', customerName: 'Jackson Lee', customerEmail: 'jackson.l@example.com', total: 150.0, status: 'Processing', date: '2024-05-22T14:00:00Z' },
  { id: 'ORD003', customerName: 'Isabella Nguyen', customerEmail: 'isabella.n@example.com', total: 350.0, status: 'Shipped', date: '2024-04-18T09:00:00Z' },
  { id: 'ORD004', customerName: 'William Kim', customerEmail: 'will.k@example.com', total: 450.0, status: 'Delivered', date: '2024-04-19T11:45:00Z' },
  { id: 'ORD005', customerName: 'Sofia Davis', customerEmail: 'sofia.d@example.com', total: 550.0, status: 'Delivered', date: '2024-03-21T16:20:00Z' },
  { id: 'ORD006', customerName: 'James Brown', customerEmail: 'james.b@example.com', total: 80.0, status: 'Delivered', date: '2024-03-15T12:00:00Z' },
  { id: 'ORD007', customerName: 'Emily White', customerEmail: 'emily.w@example.com', total: 210.0, status: 'Delivered', date: '2024-02-10T18:30:00Z' },
];

export async function getSalesOverTime(): Promise<{ month: Date; totalSales: number }[]> {
  try {
    // In a real app, you would query your 'orders' collection in Firestore.
    // For now, we process the mock data.
    const salesByMonth: { [key: string]: number } = {};

    mockOrders.forEach(order => {
      if (order.status === 'Delivered' || order.status === 'Shipped') {
        const orderDate = new Date(order.date);
        const month = new Date(orderDate.getFullYear(), orderDate.getMonth(), 1);
        const monthKey = month.toISOString();

        if (!salesByMonth[monthKey]) {
          salesByMonth[monthKey] = 0;
        }
        salesByMonth[monthKey] += order.total;
      }
    });

    const sortedMonths = Object.keys(salesByMonth).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    
    return sortedMonths.map(monthKey => ({
      month: new Date(monthKey),
      totalSales: salesByMonth[monthKey],
    }));

  } catch (error) {
    console.error("Error fetching sales data:", error);
    throw new Error('Failed to fetch sales data.');
  }
}

export async function getCategoryDistribution(): Promise<{ category: string; count: number }[]> {
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
}

export async function getTopPerformingProducts(count: number): Promise<Product[]> {
    try {
        // Using a composite index of rating and review count as a proxy for performance
        const q = query(collection(db, 'products'), orderBy('averageRating', 'desc'), orderBy('reviewCount', 'desc'), limit(count));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
        console.error("Error fetching top performing products:", error);
        throw new Error('Failed to fetch top products.');
    }
}
