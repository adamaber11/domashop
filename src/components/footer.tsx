
'use server';

import { ShoppingCart, Facebook, Instagram, Youtube } from 'lucide-react';
import Link from 'next/link';
import { getSiteSettings } from '@/lib/services/settings-service';

const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2859 3333" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" {...props}>
        <path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-398 247-358 531 77 544 1075 705 992-358V1h551z"/>
    </svg>
);


export async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-muted text-muted-foreground mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-4 md:col-span-1 sm:col-span-2">
             <Link href="/" className="flex items-center space-x-2">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <span className="font-extrabold font-headline inline-block text-3xl text-foreground">
                    {settings.logoTextPart1}<span className="text-primary">{settings.logoTextPart2}</span>{settings.logoTextPart3}
                </span>
            </Link>
            <p className="text-sm">
              Your one-stop shop for everything. Discover quality products and enjoy a seamless shopping experience.
            </p>
          </div>
          
          <div className="text-sm">
            <h3 className="font-headline font-semibold text-foreground mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link href="/category" className="hover:text-primary transition-colors">Categories</Link></li>
              <li><Link href="/" className="hover:text-primary transition-colors">All Products</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <h3 className="font-headline font-semibold text-foreground mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/account" className="hover:text-primary transition-colors">My Account</Link></li>
            </ul>
          </div>
          
          <div className="text-sm">
            <h3 className="font-headline font-semibold text-foreground mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href={settings.socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-90">
                <Facebook className="h-6 w-6" />
              </a>
              <a href={settings.socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-90">
                <Instagram className="h-6 w-6" />
              </a>
              <a href={settings.socials.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-90">
                <TikTokIcon className="h-5 w-5 fill-current" />
              </a>
               <a href={settings.socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-90">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-border pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} {settings.logoTextPart1}{settings.logoTextPart2}{settings.logoTextPart3} Online Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
