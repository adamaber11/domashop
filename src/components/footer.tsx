import { ShoppingCart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-muted text-muted-foreground mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
             <Link href="/" className="flex items-center space-x-2">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <span className="font-extrabold font-headline inline-block text-3xl text-foreground">
                    Do<span className="text-primary">m</span>a
                </span>
            </Link>
            <p className="text-sm">
              Your one-stop shop for everything. Discover quality products and enjoy a seamless shopping experience.
            </p>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold text-foreground mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/category" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-headline font-semibold text-foreground mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">My Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-headline font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-6 w-6" />
              </Link>
               <Link href="#" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Doma Online Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
