
import type { Metadata } from "next";
import { Playfair_Display, PT_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { NavigationBar } from "@/components/navigation-bar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { AdminNavbar } from "./admin/_components/admin-navbar";
import { CurrencyProvider } from "@/context/currency-context";


const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-playfair-display",
});


export const metadata: Metadata = {
  title: "Doma Online Shop",
  description: "A modern e-commerce experience.",
  keywords: [
    "Online Shop", "Doma Store", "eCommerce Egypt", "Buy Online", "Handmade Products", 
    "Electronics Online", "Fashion Online", "Home Decor", "Accessories", "Gifts Online", 
    "Kitchen Tools", "Mobile Phones", "Laptops Online", "Beauty Products", "Health & Care", 
    "Kids Toys", "Sports Equipment", "متجر إلكتروني", "دوما شوب", "تسوق أونلاين", 
    "منتجات هاند ميد", "اكسسوارات", "ديكور المنزل", "أجهزة إلكترونية", "ملابس أونلاين", 
    "مستحضرات تجميل", "منتجات العناية بالصحة", "أدوات المطبخ", "هواتف محمولة", "لاب توب", 
    "ألعاب أطفال", "معدات رياضية", "هدايا"
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body
        className={`${ptSans.variable} ${playfairDisplay.variable} font-body`}
      >
        <AuthProvider>
          <CurrencyProvider>
            <CartProvider>
              <Toaster />
              <Header />
              <NavigationBar />
              <main>{children}</main>
              <Footer />
            </CartProvider>
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
