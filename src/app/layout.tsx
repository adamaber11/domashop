import type { Metadata } from "next";
import { Playfair_Display, PT_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { NavigationBar } from "@/components/navigation-bar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { PageLoader } from "@/components/page-loader";
import { AdminNavbar } from "./admin/_components/admin-navbar";
import { usePathname } from "next/navigation";


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
          <CartProvider>
            <Toaster />
            <PageLoader />
            <Header />
            <NavigationBar />
            <main>{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
