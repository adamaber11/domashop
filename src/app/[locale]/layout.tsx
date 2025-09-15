import type { Metadata } from 'next';
import '../globals.css';
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
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

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

export default async function LocaleLayout({
  children,
  params: {locale}
}: Readonly<{
  children: React.ReactNode;
  params: {locale: string};
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body
        className={cn(
          'font-body antialiased min-h-screen flex flex-col',
          ptSans.variable,
          playfairDisplay.variable
        )}
      >
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
