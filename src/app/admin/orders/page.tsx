'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Pencil, Eye } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { getAllOrders, updateOrderStatus } from '@/lib/services/order-service';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
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

  const OrderDetailsDialog = () => (
    <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
                <DialogTitle>Order Details</DialogTitle>
                <DialogDescription>
                    Order ID: {selectedOrder?.id}
                </DialogDescription>
            </DialogHeader>
            {selectedOrder && (
                <div className="grid gap-4 py-4 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                       <div><strong>Customer:</strong> {selectedOrder.customerName}</div>
                       <div><strong>Email:</strong> {selectedOrder.customerEmail}</div>
                       <div><strong>Date:</strong> {format(selectedOrder.date.toDate(), 'PPP')}</div>
                       <div><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</div>
                       <div><strong>Status:</strong> <Badge variant={selectedOrder.status === "Delivered" ? "default" : "secondary"}>{selectedOrder.status}</Badge></div>
                    </div>
                    <Separator />
                    <div>
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-muted-foreground">
                            {selectedOrder.shippingAddress.address}<br/>
                            {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                        </p>
                    </div>
                    <Separator />
                     <div>
                        <h4 className="font-semibold mb-2">Items</h4>
                        <div className="space-y-2">
                        {selectedOrder.items.map(item => (
                            <div key={item.product.id} className="flex justify-between items-center">
                                <span>{item.product.name} x {item.quantity}</span>
                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
    </Dialog>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
        </div>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Orders</h1>
            <p className="text-muted-foreground">Manage all customer orders.</p>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id.substring(0, 7)}...</TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell>{format(order.date.toDate(), 'PPP')}</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "Delivered" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => setSelectedOrder(order)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          {(['Processing', 'Shipped', 'Delivered', 'Cancelled'] as const).map(status => (
                            <DropdownMenuItem key={status} onSelect={() => handleStatusChange(order.id, status)} disabled={order.status === status}>
                                {status}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <OrderDetailsDialog />
    </>
  );
}
