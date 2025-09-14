'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import type { Order } from '@/lib/types';


// Mock data - in a real application, this would come from your 'orders' collection
const mockOrders: Order[] = [
  { id: 'ORD001', customerName: 'Olivia Martin', customerEmail: 'olivia.m@example.com', total: 250.0, status: 'Delivered', date: '2024-05-20T10:30:00Z' },
  { id: 'ORD002', customerName: 'Jackson Lee', customerEmail: 'jackson.l@example.com', total: 150.0, status: 'Processing', date: '2024-05-22T14:00:00Z' },
  { id: 'ORD003', customerName: 'Isabella Nguyen', customerEmail: 'isabella.n@example.com', total: 350.0, status: 'Shipped', date: '2024-05-18T09:00:00Z' },
  { id: 'ORD004', customerName: 'William Kim', customerEmail: 'will.k@example.com', total: 450.0, status: 'Delivered', date: '2024-05-19T11:45:00Z' },
  { id: 'ORD005', customerName: 'Sofia Davis', customerEmail: 'sofia.d@example.com', total: 550.0, status: 'Cancelled', date: '2024-05-21T16:20:00Z' },
];


export async function getDashboardStats() {
    try {
        const adminApp = getFirebaseAdminApp();
        const auth = getAuth(adminApp);

        const usersPromise = auth.listUsers();
        const productsPromise = getDocs(collection(db, 'products'));
        // In a real app, you would query an 'orders' collection
        // For now, we use mock data for revenue, sales, and recent orders
        const ordersPromise = Promise.resolve(mockOrders);

        const [userRecords, productsSnapshot, orders] = await Promise.all([
            usersPromise,
            productsPromise,
            ordersPromise,
        ]);

        const totalUsers = userRecords.users.length;
        const totalProducts = productsSnapshot.size;

        // Calculate stats from mock orders
        const totalRevenue = orders
            .filter(order => order.status === 'Delivered' || order.status === 'Shipped')
            .reduce((sum, order) => sum + order.total, 0);
            
        const totalSales = orders.length;

        const recentOrders = orders
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
        
        return {
            totalRevenue,
            totalSales,
            totalProducts,
            totalUsers,
            recentOrders
        };

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        throw new Error('Failed to fetch dashboard statistics.');
    }
}
