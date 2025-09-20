'use client';

import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from './add-to-cart-button';
import { useCurrency } from '@/context/currency-context';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { ProductGallery } from './product-gallery';

interface ProductDetailsProps {
  product: Product;
}

const StockBadge = ({ stock }: { stock: number}) => {
  if (stock === 0) {
    return <Badge variant="destructive">Out of Stock</Badge>
  }
  if (stock <= 5) {
     return <Badge variant="secondary">Low Stock ({stock} left)</Badge>
  }
  return <Badge>In Stock</Badge>
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { selectedCurrency } = useCurrency();

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
      <div className="grid grid-cols-1 gap-6">
        <ProductGallery imageUrls={product.imageUrls} imageHint={product.imageHint} />
        {product.onSale && (
          <Badge variant="destructive" className="absolute top-4 start-4 text-sm md:text-base z-10">Sale</Badge>
        )}
      </div>

      <div className="space-y-6 md:sticky md:top-24">
        <div className="space-y-2">
          <StockBadge stock={product.stock} />
          <h1 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{product.name}</h1>
        </div>

        <div className="flex items-center gap-2">
          <StarRating rating={product.averageRating} />
          <span className="text-sm text-muted-foreground">{product.averageRating.toFixed(1)} ({product.reviewCount} reviews)</span>
        </div>

        <div className="flex items-baseline gap-3">
          {product.onSale && typeof product.salePrice === 'number' ? (
            <>
              <p className="text-3xl md:text-4xl font-bold text-destructive">{formatPrice(product.salePrice, selectedCurrency)}</p>
              <p className="text-xl md:text-2xl font-semibold text-muted-foreground line-through">{formatPrice(product.price, selectedCurrency)}</p>
            </>
          ) : (
            <p className="text-2xl md:text-3xl font-semibold">{formatPrice(product.price, selectedCurrency)}</p>
          )}
        </div>

        <p className="text-base sm:text-lg text-muted-foreground">{product.description}</p>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
