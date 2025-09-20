
'use server';

import { HeroCarousel } from "@/components/hero-carousel";
import { ProductCard } from "@/components/product-card";
import { getFeaturedProducts } from "@/lib/services/product-service";
import { getSiteSettings } from "@/lib/services/settings-service";
import { ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts(10);
  const settings = await getSiteSettings();

  // Get 3 random products from the featured list for efficiency
  const randomProducts = [...featuredProducts].sort(() => 0.5 - Math.random()).slice(0, 3);

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="w-full pt-8">
        <div className="w-[98%] mx-auto">
          <HeroCarousel heroImages={settings.heroImages} delay={settings.heroCarouselDelay} />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mt-8 flex justify-center">
              <Link href="/offers" className="group text-lg font-semibold text-foreground/80 hover:text-primary transition-colors relative pb-2 border-b border-foreground/20 after:content-[''] after:absolute after:bottom-[-1px] after:start-1/2 after:-translate-x-1/2 after:h-[2px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-center after:transition-transform after:duration-300">
                  <span className="flex items-center gap-2">
                      Shop All Offers
                      <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
              </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-headline text-3xl md:text-4xl font-bold mb-8 text-center">
          Featured Products
        </h2>
        {featuredProducts.length > 0 ? (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3">
                  <div className="p-1">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute start-0 top-1/2 -translate-y-1/2 -translate-x-4 hidden md:flex" />
            <CarouselNext className="absolute end-0 top-1/2 -translate-y-1/2 translate-x-4 hidden md:flex" />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">
            No featured products available. Please check back later.
          </p>
        )}
      </div>

      {/* New Orange Promotion Section */}
      {randomProducts.length >= 3 && (
        <div className="w-full bg-primary/10 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                 <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4 text-primary">
                    Discover Something New
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                    Handpicked just for you. Click on any product to see more details.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    {randomProducts.map(product => {
                        const imageUrl = product.imageUrls?.[0];
                        return (
                            <Link href={`/products/${product.id}`} key={product.id} className="group block">
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                                    {imageUrl && (
                                        <Image
                                            src={imageUrl}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            data-ai-hint={product.imageHint}
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                       <h3 className="text-white text-xl font-bold font-headline text-center p-4 drop-shadow-md">{product.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                 <Button asChild size="lg">
                    <Link href="/category">
                        <ShoppingBag className="me-2 h-5 w-5" />
                        Shop All Categories
                    </Link>
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
