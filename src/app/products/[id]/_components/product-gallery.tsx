"use client";

import { useState } from 'react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface ProductGalleryProps {
  imageIds: string[];
  imageHint: string;
}

export function ProductGallery({ imageIds, imageHint }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(imageIds[0]);

  const images = imageIds.map(id => PlaceHolderImages.find(p => p.id === id)).filter(Boolean);

  if (images.length === 0) {
    return null; 
  }

  const selectedPlaceholder = images.find(img => img?.id === selectedImage);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="relative aspect-square w-full">
            {selectedPlaceholder && (
                <Image
                    src={selectedPlaceholder.imageUrl}
                    alt={selectedPlaceholder.description}
                    fill
                    className="object-cover"
                    data-ai-hint={imageHint}
                    priority
                />
            )}
        </div>
      </Card>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-4">
          {images.map((image) => image && (
            <Card
              key={image.id}
              onClick={() => setSelectedImage(image.id)}
              className={cn(
                'overflow-hidden cursor-pointer transition-all border-2',
                selectedImage === image.id ? 'border-primary' : 'border-transparent hover:border-primary/50'
              )}
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 20vw, 10vw"
                  data-ai-hint={image.imageHint}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
