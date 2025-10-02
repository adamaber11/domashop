import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { NavigationBar } from "@/components/navigation-bar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { CurrencyProvider } from "@/context/currency-context";
import { getSiteSettings } from "@/lib/services/settings-service";

// استدعاء خط Cairo
const cairo = Cairo({
  subsets: ["latin", "arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-cairo",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = `${settings.logoTextPart1}${settings.logoTextPart2}${settings.logoTextPart3} Online Shop`;
  const description = settings.welcomeSubheading;
  const siteUrl = "https://doma-shop.vercel.app"; 
  const ogImage = `${siteUrl}/og-image.png`; 

  return {
    title,
    description,
    keywords: [
      "Online Shop", "Doma Store", "eCommerce Egypt", "Buy Online", "Handmade Products", 
      "Electronics Online", "Fashion Online", "Home Decor", "Accessories", "Gifts Online", 
      "Kitchen Tools", "Mobile Phones", "Laptops Online", "Beauty Products", "Health & Care", 
      "Kids Toys", "Sports Equipment", "متجر إلكتروني", "دوما شوب", "تسوق أونلاين", 
      "منتجات هاند ميد", "اكسسوارات", "ديكور المنزل", "أجهزة إلكترونية", "ملابس أونلاين", 
      "مستحضرات تجميل", "منتجات العناية بالصحة", "أدوات المطبخ", "هواتف محمولة", "لاب توب", 
      "ألعاب أطفال", "معدات رياضية", "هدايا"
    ],
    verification: {
      google: "Q93NKffchZec6bIJJZWfLdrOh__ENY5f6NLi00joc7s",
    },
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: "Doma Online Shop",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "Doma Online Shop",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
      creator: "@yourtwitterhandle",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${cairo.variable} font-sans text-sm`} 
      >
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <Toaster />
              <Header />
              <NavigationBar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
