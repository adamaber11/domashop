// src/app/about/page.tsx
'use server';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getPagesContent } from "@/lib/services/pages-service";

export default async function AboutPage() {
  const { about } = await getPagesContent();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
            {about.headline}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            {about.subheading}
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={about.bannerImageUrl}
              alt="Our Team"
              fill
              className="object-cover"
              data-ai-hint="team business"
            />
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg mb-4">
              {about.mission}
            </p>
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-lg">
              {about.vision}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
