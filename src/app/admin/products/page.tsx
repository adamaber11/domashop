
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from '@/components/ui/badge';
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { deleteProduct, getAllProducts } from '@/lib/services/product-service';
import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';

export default function AdminProductsPage({ serverProducts }: { serverProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(serverProducts);
  const [productToDelete, setProductToDelete] = useState<{id: string, name: string} | null>(null);
  const { toast } = useToast();
  const router = useRouter();


  const handleDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: 'Product Deleted',
        description: `Product "${productToDelete.name}" has been successfully deleted.`,
      });
      // Optimistically update UI
      setProducts(products.filter(p => p.id !== productToDelete.id));
      // Or refetch from server
      // router.refresh();
    } catch (error) {
        console.error('Failed to delete product:', error);
        toast({
            title: 'Error',
            description: 'Failed to delete product. Please try again.',
            variant: 'destructive',
        });
    } finally {
        setProductToDelete(null);
    }
  }


  return (
    <>
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">Products</h1>
            <p className="text-muted-foreground">Manage all products in your store.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
                products.map((product) => {
                    const placeholder = PlaceHolderImages.find(p => p.id === product.imageIds[0]);
                    return (
                        <TableRow key={product.id}>
                            <TableCell>
                                <div className="w-16 h-16 relative">
                                    {placeholder && (
                                        <Image
                                        src={placeholder.imageUrl}
                                        alt={product.name}
                                        fill
                                        className="rounded-md object-cover"
                                        />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell>
                                <Badge variant={product.onSale ? "secondary" : "default"}>
                                    {product.onSale ? 'On Sale' : 'Active'}
                                </Badge>
                            </TableCell>
                            <TableCell>${product.price.toFixed(2)}</TableCell>
                            <TableCell>{product.reviewCount} ({product.averageRating.toFixed(1)} avg)</TableCell>
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
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/products/${product.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            onSelect={() => setProductToDelete({ id: product.id, name: product.name })}
                                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                                        >
                                                <Trash2 className="mr-2 h-4 w-4" />Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    );
                })
            ) : (
                <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">
                        No products found.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>

    <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the product "{productToDelete?.name}" and all its associated reviews.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
