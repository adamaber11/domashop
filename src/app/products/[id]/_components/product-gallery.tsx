"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import ReactImageMagnify from 'react-image-magnify';

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
       <Card className="overflow-hidden w-full aspect-square relative">
         <ReactImageMagnify {...{
            smallImage: {
                alt: imageHint,
                isFluidWidth: true,
                src: selectedImage
            },
            largeImage: {
                src: selectedImage,
                width: 1200,
                height: 1200
            },
            lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' },
            shouldUsePositiveSpaceLens: true,
         }} />
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
