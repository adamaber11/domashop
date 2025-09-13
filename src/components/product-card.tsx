"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StarRating } from './star-rating';
import { Button } from './ui/button';
import { Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';


interface ProductCardProps {
  product: Product;
}


export function ProductCard({ product }: ProductCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === product.imageIds[0]);
  
  const { addToCart } = useCart();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    if (loading) return;

    if (!user) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to add items to the cart.',
        variant: 'destructive',
      });
      router.push('/login');
    } else {
      addToCart(product, 1);
    }
  };


  return (
    <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}>
            {placeholder && (
              <Image
                src={placeholder.imageUrl}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, (max-width: 1280px) 30vw, 23vw"
                data-ai-hint={product.imageHint}
              />
            )}
          </Link>
          {product.onSale && (
            <Badge variant="destructive" className="absolute top-2 right-2">Sale</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="hover:text-primary">
          <CardTitle className="font-headline text-lg md:text-xl leading-tight tracking-tight h-12 line-clamp-2">
            {product.name}
          </CardTitle>
        </Link>
        <div className="mt-2 flex items-center">
          <StarRating rating={product.averageRating} />
          <span className="text-xs text-muted-foreground ml-2">({product.reviewCount} reviews)</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="flex items-baseline gap-2">
            {product.onSale && typeof product.salePrice === 'number' ? (
                <>
                    <p className="text-base md:text-lg font-semibold text-destructive">${product.salePrice.toFixed(2)}</p>
                    <p className="text-sm font-medium text-muted-foreground line-through">${product.price.toFixed(2)}</p>
                </>
            ) : (
                <p className="text-base md:text-lg font-semibold">${product.price.toFixed(2)}</p>
            )}
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
           <Button asChild variant="outline" size="icon">
              <Link href={`/products/${product.id}`}>
                <Eye className="h-5 w-5" />
                <span className="sr-only">View Product</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" onClick={handleAddToCartClick} disabled={loading}>
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Add to Cart</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
