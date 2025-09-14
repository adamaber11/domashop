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

    const observer = new MutationObserver((mutations) => {
      const isNavigating = Array.from(mutations).some(
        (mutation) =>
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-next-router-primary-loading'
      );
      if (isNavigating) {
        handleStart();
      }
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['data-next-router-primary-loading'],
    });

    // Initial load stop
    handleStop();

    return () => {
      observer.disconnect();
      handleStop();
    };
  }, []);

  // On every route change, we call done().
  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  if (!loading) {
    return null;
  }

  return (
    <div className="page-loader-overlay">
      <div className="page-loader-spinner"></div>
    </div>
  );
}
