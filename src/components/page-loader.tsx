'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    // We need to use a mutation observer to detect when the Next.js router
    // is about to navigate. This is a common workaround for showing a loader
    // with the App Router.
    const observer = new MutationObserver((mutations) => {
      // Check if the 'data-next-router-primary-loading' attribute appears on the body
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

    // Fallback for the initial load and when the observer doesn't fire
    handleStop();

    return () => {
      observer.disconnect();
      handleStop(); // Ensure it stops on component unmount
    };
  }, []);

  // On every route change, we call done().
  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return null;
}
