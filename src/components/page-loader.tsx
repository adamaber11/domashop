'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleStop = () => setLoading(false);

    // This logic is simplified to listen to route changes rather than observing body attributes,
    // as the primary use case is to show a loader on navigation.
    // The previous attribute observer was complex and could be unreliable.

    // On initial load stop
    handleStop();
    
    // In a real app, you might use router events if available or other mechanisms.
    // For this component, we will rely on the useEffect for pathname and searchParams.

  }, []);

  // On every route change, we show the loader, and then hide it once the new page content is likely settled.
  // This is a simplified approach. A more robust solution might involve Next.js's top-level loading.tsx file
  // or more complex state management.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 750); // Simulating load time
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);


  useEffect(() => {
    // This effect is to ensure the loader is turned off once everything is mounted.
    // It helps in cases where the route change effect might not cover all scenarios.
    const handleLoad = () => {
      setLoading(false);
    };
    window.addEventListener('load', handleLoad);
    
    // Initial state check
    if (document.readyState === 'complete') {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);


  if (!loading) {
    return null;
  }

  return (
    <div className="page-loader-overlay">
      <div className="page-loader-spinner"></div>
    </div>
  );
}
