'use server';

import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/services/product-service";
import { getSiteSettings } from "@/lib/services/settings-service";
import Link from "next/link";


export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(8);
  const settings = await getSiteSettings();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-12 md:py-20 text-center">
        <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter">
          {settings.welcomeHeadline}
        </h1>
        <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {settings.welcomeSubheading}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/category">Shop Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>

      <div className="mb-16">
        <HeroCarousel heroImages={settings.heroImages} />
      </div>

      <div>
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No featured products available. Please check back later.
          </p>
        )}
      </div>
    </div>
  );
}
