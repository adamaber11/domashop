'use server';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { HeroCarousel } from '@/components/hero-carousel';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { getFeaturedProducts } from '@/lib/services/product-service';
import { getSiteSettings } from '@/lib/services/settings-service';

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(10);
  const settings = await getSiteSettings();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <section className="text-center py-16 md:py-24">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
          {settings.welcomeHeadline}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {settings.welcomeSubheading}
        </p>
        <div className="mt-8 max-w-4xl mx-auto">
          <HeroCarousel heroImages={settings.heroImages} />
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <h2 className="font-headline text-3xl font-bold text-center mb-10">
          Featured Products
        </h2>
        {featuredProducts.length > 0 ? (
          <Carousel 
            opts={{ align: "start", loop: true }}
            className="w-full"
          >
            <CarouselContent>
              {featuredProducts.map((product: Product) => (
                <CarouselItem key={product.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="p-1 h-full">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden sm:flex" />
          </Carousel>
        ) : (
          <p className="text-center text-muted-foreground">No featured products available. Please check back later.</p>
        )}
      </section>
    </div>
  );
}
