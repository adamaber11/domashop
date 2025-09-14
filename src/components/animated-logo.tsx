
'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/services/settings-service';
import type { SiteSettings } from '@/lib/types';
import { Skeleton } from './ui/skeleton';

export function AnimatedLogo() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [visibleChars, setVisibleChars] = useState(0);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const fullLogoText = settings ? `${settings.logoTextPart1}${settings.logoTextPart2}${settings.logoTextPart3}` : '';
  const part1Length = settings ? settings.logoTextPart1.length : 0;
  const part2Length = settings ? settings.logoTextPart2.length : 0;

  useEffect(() => {
    if (!settings) return;

    const totalLength = fullLogoText.length;
    let timer: NodeJS.Timeout;

    if (isErasing) {
      if (visibleChars > 0) {
        timer = setTimeout(() => {
          setVisibleChars(prev => prev - 1);
        }, 80); 
      } else {
        // After erasing, pause then start writing again
        timer = setTimeout(() => {
          setIsErasing(false);
        }, 1000);
      }
    } else {
      if (visibleChars < totalLength) {
        timer = setTimeout(() => {
          setVisibleChars(prev => prev + 1);
        }, 150);
      } else {
         // After writing, pause then start erasing
        timer = setTimeout(() => {
          setIsErasing(true);
        }, 2500);
      }
    }

    return () => clearTimeout(timer);
  }, [visibleChars, isErasing, settings, fullLogoText.length]);


  if (!settings) {
    return (
        <div className="mb-8 text-center h-20 flex items-center justify-center">
            <Skeleton className="h-12 w-64 mx-auto" />
        </div>
    );
  }

  const renderLogo = () => {
    return fullLogoText.split('').map((char, index) => {
      let colorClass = 'text-foreground';
      if (index >= part1Length && index < part1Length + part2Length) {
        colorClass = 'text-primary';
      }

      return (
        <span
          key={index}
          className={`
            transition-opacity duration-300
            ${colorClass}
            ${index < visibleChars ? 'opacity-100' : 'opacity-0'}
          `}
          style={{ animation: index < visibleChars ? `fadeIn 0.5s ease-in-out` : 'none' }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="mb-8 text-center h-20 flex items-center justify-center">
      <h1 className="font-extrabold font-headline text-5xl md:text-6xl inline-block tracking-tighter">
        {renderLogo()}
        <span className="animate-caret-blink border-r-4 border-foreground ml-1"></span>
      </h1>
    </div>
  );
}
