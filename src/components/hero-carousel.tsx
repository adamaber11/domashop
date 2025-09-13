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

const carouselItems = [
  {
    src: "https://picsum.photos/seed/101/1200/500",
    alt: "A stunning landscape with mountains and a lake.",
    hint: "landscape mountains"
  },
  {
    src: "https://picsum.photos/seed/102/1200/500",
    alt: "A modern city skyline at night with illuminated buildings.",
    hint: "city skyline"
  },
];

export function HeroCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {carouselItems.map((item, index) => (
          <CarouselItem key={index}>
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1200}
                  height={500}
                  className="w-full h-auto object-cover aspect-[2.4/1]"
                  data-ai-hint={item.hint}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
