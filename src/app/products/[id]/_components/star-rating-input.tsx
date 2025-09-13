"use client"

import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  maxRating?: number;
}

export function StarRatingInput({ value, onChange, maxRating = 5 }: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
            className="cursor-pointer"
            aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                starValue <= (hoverRating || value)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
