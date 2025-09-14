
'use client';

import { useState, useEffect } from 'react';
import { getSiteSettings } from '@/lib/services/settings-service';
import type { SiteSettings } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from './ui/skeleton';

export function AnimatedLogo() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [part1, setPart1] = useState('');
  const [part2, setPart2] = useState('');
  const [part3, setPart3] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseDuration = 1500;

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  useEffect(() => {
    if (!settings) return;

    const toRotate = [
        [settings.logoTextPart1, settings.logoTextPart2, settings.logoTextPart3]
    ];
    
    let ticker = setInterval(() => {
      tick();
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearInterval(ticker);

    function tick() {
      const i = loopNum % toRotate.length;
      const [fullText1, fullText2, fullText3] = toRotate[i];
      let newPart1 = part1, newPart2 = part2, newPart3 = part3;

      if (isDeleting) {
        if (newPart3.length > 0) newPart3 = fullText3.substring(0, newPart3.length - 1);
        else if (newPart2.length > 0) newPart2 = fullText2.substring(0, newPart2.length - 1);
        else if (newPart1.length > 0) newPart1 = fullText1.substring(0, newPart1.length - 1);
      } else {
        if (newPart1.length < fullText1.length) newPart1 = fullText1.substring(0, newPart1.length + 1);
        else if (newPart2.length < fullText2.length) newPart2 = fullText2.substring(0, newPart2.length + 1);
        else if (newPart3.length < fullText3.length) newPart3 = fullText3.substring(0, newPart3.length + 1);
      }
      
      setPart1(newPart1);
      setPart2(newPart2);
      setPart3(newPart3);

      if (!isDeleting && newPart1 === fullText1 && newPart2 === fullText2 && newPart3 === fullText3) {
        setTimeout(() => setIsDeleting(true), pauseDuration);
      } else if (isDeleting && newPart1 === '' && newPart2 === '' && newPart3 === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    }

  }, [settings, part1, part2, part3, isDeleting, loopNum]);


  if (!settings) {
    return (
        <div className="mb-8 text-center">
            <Skeleton className="h-12 w-64 mx-auto" />
        </div>
    );
  }

  return (
    <div className="mb-8 text-center">
      <h1 className="font-extrabold font-headline text-5xl md:text-6xl inline-block tracking-tighter">
        <span className="text-foreground">{part1}</span>
        <span className="text-primary">{part2}</span>
        <span className="text-foreground">{part3}</span>
        <span className="animate-caret-blink border-r-4 border-foreground"></span>
      </h1>
    </div>
  );
}
