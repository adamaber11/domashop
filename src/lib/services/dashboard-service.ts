'use server';

import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import type { Order } from '@/lib/types';
import { getAllOrders } from './order-service';
import { getAllUsers } from './user-service';
import { unstable_cache as cache } from 'next/cache';

export const getDashboardStats = cache(async () => {
    try {
        const productsCollection = collection(db, 'products');
        const productsCountPromise = getCountFromServer(productsCollection);
        const ordersPromise = getAllOrders();
        const usersPromise = getAllUsers();

        const [productsCountSnapshot, orders, users] = await Promise.all([
            productsCountPromise,
            ordersPromise,
            usersPromise,
        ]);

        const totalUsers = users.length;
        const totalProducts = productsCountSnapshot.data().count;

        const totalRevenue = orders
            .filter(order => order.status === 'Delivered' || order.status === 'Shipped')
            .reduce((sum, order) => sum + order.total, 0);
            
        const totalSales = orders.length;

        const recentOrders = orders.slice(0, 5);
        
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
}, ['dashboard-stats'], { revalidate: 60 });
