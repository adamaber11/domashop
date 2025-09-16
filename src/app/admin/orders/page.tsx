'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Eye, ChevronDown, ChevronRight, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getAllOrders, updateOrderStatus } from '@/lib/services/order-service';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [openOrderId, setOpenOrderId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        toast({
          title: 'Error fetching orders',
          description: 'Could not load orders from the database.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [toast]);

  const handleStatusChange = async (orderId: string, status: Order['status']) => {
    try {
        await updateOrderStatus(orderId, status);
        setOrders(prevOrders => 
            prevOrders.map(order => 
                order.id === orderId ? { ...order, status } : order
            )
        );
        toast({
            title: 'Order Status Updated',
            description: `Order ${orderId.substring(0,7)}... is now ${status}.`
        })
    } catch (error) {
        toast({
            title: 'Update Failed',
            description: 'Could not update order status.',
            variant: 'destructive',
        });
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
        const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
        const matchesSearch = searchTerm === '' ||
            order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });
  }, [orders, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
        </div>
        <Card className="mb-6">
            <CardContent className="p-4 flex gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-48" />
            </CardContent>
        </Card>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(6)].map((_, i) => <TableHead key={i}><Skeleton className="h-5 w-full" /></TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  {[...Array(6)].map((_, j) => <TableCell key={j}><Skeleton className="h-5 w-full" /></TableCell>)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
            <p className="text-muted-foreground">Manage all customer orders.</p>
          </div>
        </div>

        <Card className="mb-6">
            <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search by name, email, or order ID..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>


        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-end">Total (USD)</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                 <Collapsible asChild key={order.id} open={openOrderId === order.id} onOpenChange={() => setOpenOrderId(prev => prev === order.id ? null : order.id)}>
                    <>
                        <TableRow className="cursor-pointer">
                            <TableCell>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        {openOrderId === order.id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                    </Button>
                                </CollapsibleTrigger>
                            </TableCell>
                            <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                            <TableCell>{order.customerName}</TableCell>
                            <TableCell>{format(order.date.toDate(), 'PPP')}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    order.status === 'Delivered' ? 'default' : 
                                    order.status === 'Processing' ? 'secondary' : 
                                    order.status === 'Cancelled' ? 'destructive' : 'outline'
                                }>
                                {order.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-end">${order.total.toFixed(2)}</TableCell>
                            <TableCell className="text-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                {(['Processing', 'Confirmed', 'Out for Delivery', 'Delivered', 'Cancelled'] as const).map(status => (
                                    <DropdownMenuItem key={status} onSelect={() => handleStatusChange(order.id, status as Order['status'])} disabled={order.status === status}>
                                        {status}
                                    </DropdownMenuItem>
                                ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        <CollapsibleContent asChild>
                            <TableRow>
                                <TableCell colSpan={7} className="p-0">
                                    <div className="p-4 bg-muted/50">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                            <div>
                                                <h4 className="font-semibold mb-2">Contact & Shipping</h4>
                                                <p><strong>Name:</strong> {order.customerName}</p>
                                                <p><strong>Email:</strong> {order.customerEmail}</p>
                                                <p><strong>Phone:</strong> {order.customerPhone}</p>
                                                <p className="mt-2">
                                                    <strong>Address:</strong><br/>
                                                    {order.shippingAddress.address}<br/>
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                                                </p>
                                            </div>
                                             <div>
                                                <h4 className="font-semibold mb-2">Order Items</h4>
                                                <div className="space-y-2">
                                                {order.items.map(item => {
                                                    const imageUrl = item.product.imageUrls?.[0];
                                                    return (
                                                        <div key={item.product.id} className="flex items-center gap-4">
                                                            <div className="relative w-12 h-12 flex-shrink-0">
                                                                {imageUrl && <Image src={imageUrl} alt={item.product.name} fill className="rounded-md object-cover" />}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{item.product.name}</p>
                                                                <p className="text-muted-foreground">Qty: {item.quantity} x ${item.product.price.toFixed(2)}</p>
                                                            </div>
                                                            <p className="ml-auto font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                                                        </div>
                                                    )
                                                })}
                                                </div>
                                                <Separator className="my-2"/>
                                                <div className="flex justify-between">
                                                    <p>Payment Method:</p>
                                                    <p className="font-medium">Cash on Delivery</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </CollapsibleContent>
                    </>
                 </Collapsible>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    No orders match your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
