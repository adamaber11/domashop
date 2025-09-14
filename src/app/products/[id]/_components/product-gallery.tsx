"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ProductGalleryProps {
  imageUrls: string[];
  imageHint: string;
}

export function ProductGallery({ imageUrls, imageHint }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(imageUrls[0]);

  if (!imageUrls || imageUrls.length === 0) {
    return null; 
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full">
            {selectedImage && (
                <Image
                    src={selectedImage}
                    alt={imageHint}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                    priority
                />
            )}
        </div>
      </Card>
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {imageUrls.map((url, index) => (
            <Card
              key={index}
              onClick={() => setSelectedImage(url)}
              className={cn(
                'overflow-hidden cursor-pointer transition-all border-2',
                selectedImage === url ? 'border-primary' : 'border-transparent hover:border-primary/50'
              )}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={url}
                  alt={`${imageHint} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 10vw"
                  data-ai-hint={imageHint}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
