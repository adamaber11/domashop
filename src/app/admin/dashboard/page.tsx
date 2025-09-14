'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingBag, Users, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getDashboardStats } from '@/lib/services/dashboard-service';
import type { Order } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  totalRevenue: number;
  totalSales: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const dashboardStats = await getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <Skeleton className="h-10 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </header>
        <main className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-5 w-1/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            An overview of your store's performance.
          </p>
        </header>

        <main className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  From all completed orders.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Sales</CardTitle>
                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{stats.totalSales}</div>
                <p className="text-xs text-muted-foreground">
                  Total orders placed.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Products
                </CardTitle>
                <Package className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                 <div className="text-2xl font-bold">{stats.totalProducts}</div>
                 <p className="text-xs text-muted-foreground">
                    Total active products.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Users
                </CardTitle>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Total registered users.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>A list of the 5 most recent orders.</CardDescription>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="#">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.length > 0 ? stats.recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                      <TableCell>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground hidden md:inline">
                              {order.customerEmail}
                          </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                              order.status === 'Delivered' ? 'default' : 
                              order.status === 'Processing' ? 'secondary' : 'destructive'
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        ${order.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">No orders found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
