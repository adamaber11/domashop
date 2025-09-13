import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { StarRating } from './star-rating';
import { Button } from './ui/button';
import { Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const placeholder = PlaceHolderImages.find(p => p.id === product.imageId);
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;
  const { addToCart } = useCart();

  return (
    <Card className="group flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Link href={`/products/${product.id}`} aria-label={`View ${product.name}`}>
            {placeholder && (
              <Image
                src={placeholder.imageUrl}
                alt={product.description}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 23vw"
                data-ai-hint={product.imageHint}
              />
            )}
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/products/${product.id}`} className="hover:text-primary">
          <CardTitle className="font-headline text-xl leading-tight tracking-tight">
            {product.name}
          </CardTitle>
        </Link>
        <div className="mt-2 flex items-center">
          <StarRating rating={averageRating} />
          <span className="text-xs text-muted-foreground ml-2">({product.reviews.length} reviews)</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
        <div className="flex items-center gap-2">
           <Button asChild variant="outline" size="icon">
              <Link href={`/products/${product.id}`}>
                <Eye className="h-5 w-5" />
                <span className="sr-only">View Product</span>
              </Link>
            </Button>
            <Button variant="outline" size="icon" onClick={() => addToCart(product, 1)}>
              <ShoppingBag className="h-5 w-5" />
              <span className="sr-only">Add to Cart</span>
            </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
