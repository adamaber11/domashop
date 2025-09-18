
"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from "./ui/card";
import type { HeroImage } from "@/lib/types";
import { Skeleton } from "./ui/skeleton";

interface HeroCarouselProps {
  heroImages: HeroImage[];
  delay: number;
}

export function HeroCarousel({ heroImages, delay = 4000 }: HeroCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay, stopOnInteraction: true })
  );

  if (!heroImages || heroImages.length === 0) {
    return (
      <Card className="overflow-hidden rounded-none">
        <CardContent className="p-0">
          <Skeleton className="w-full aspect-[2.4/1]" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {heroImages.map((item, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden rounded-none">
              <CardContent className="p-0 relative aspect-[2.4/1]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  data-ai-hint={item.hint}
                  priority={index === 0}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
