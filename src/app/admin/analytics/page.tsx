// src/app/admin/analytics/page.tsx
'use server';

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
import { LineChart, PieChart } from 'lucide-react';
import {
  getSalesOverTime,
  getCategoryDistribution,
  getTopPerformingProducts,
} from '@/lib/services/analytics-service';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

const SalesChart = dynamic(() => import('./_components/sales-chart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

const CategoryChart = dynamic(() => import('./_components/category-chart'), {
  ssr: false,
  loading: () => <Skeleton className="h-[300px] w-full" />,
});

export default async function AnalyticsPage() {
  const salesData = await getSalesOverTime();
  const categoryData = await getCategoryDistribution();
  const topProducts = await getTopPerformingProducts(5);

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Store Analytics
          </h1>
          <p className="text-muted-foreground">
            Insights into your store's performance.
          </p>
        </header>

        <main className="grid gap-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 me-2 text-muted-foreground" />
                  Monthly Sales
                </CardTitle>
                <CardDescription>
                  Overview of revenue over the past months.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SalesChart data={salesData} />
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 me-2 text-muted-foreground" />
                  Category Distribution
                </CardTitle>
                <CardDescription>
                  Breakdown of products by category.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryChart data={categoryData} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>
                Your best-selling products based on ratings and reviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-end">Rating (Reviews)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((product) => {
                    const imageUrl = product.imageUrls?.[0];
                    return (
                        <TableRow key={product.id}>
                        <TableCell>
                            {imageUrl && (
                                <Image
                                    src={imageUrl}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="rounded-md object-cover w-12 h-12"
                                />
                            )}
                        </TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell className="text-end">
                          {product.averageRating.toFixed(1)} ({product.reviewCount})
                        </TableCell>
                        </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
