import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/cart-context';
import { NavigationBar } from '@/components/navigation-bar';
import { AuthProvider } from '@/context/auth-context';
import { PageLoader } from '@/components/page-loader';
import { Suspense } from 'react';
import { PT_Sans, Playfair_Display } from 'next/font/google';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Doma Online Shop',
  description: 'Your one-stop shop for everything.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-body antialiased min-h-screen flex flex-col',
          ptSans.variable,
          playfairDisplay.variable
        )}
      >
        <Suspense>
          <PageLoader />
        </Suspense>
        <AuthProvider>
          <CartProvider>
            <Header />
            <NavigationBar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
