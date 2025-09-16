'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function PageLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  // On every route change, we show the loader, and then hide it once the new page content is likely settled.
  // This is a simplified approach. A more robust solution might involve Next.js's top-level loading.tsx file
  // or more complex state management.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 750); // Simulating load time
    return () => clearTimeout(timer);
  }, [pathname]);


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
