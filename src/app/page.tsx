
'use server';

import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/services/product-service";
import { getSiteSettings } from "@/lib/services/settings-service";
import { ArrowRight } from "lucide-react";
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
      </div>

      <div className="mb-16">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
          Our Best Offers
        </h2>
        <HeroCarousel heroImages={settings.heroImages} delay={settings.heroCarouselDelay} />
        <div className="mt-8 flex justify-center">
            <Link href="/offers" className="group text-lg font-semibold text-foreground/80 hover:text-primary transition-colors relative after:content-[''] after:absolute after:bottom-0 after:start-1/2 after:-translate-x-1/2 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform after:duration-300">
                <span className="flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
            </Link>
        </div>
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
