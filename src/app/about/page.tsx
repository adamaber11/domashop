import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div className="text-center">
          <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
            About Doma Online Shop
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Your trusted partner in discovering quality, style, and innovation. We are more than just a store; we are a community of enthusiasts dedicated to bringing you the best.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src="https://picsum.photos/seed/about/1600/600"
              alt="Our Team"
              fill
              className="object-cover"
              data-ai-hint="team business"
            />
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-headline text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground text-lg mb-4">
              To provide an unparalleled online shopping experience by offering a curated selection of high-quality products, exceptional customer service, and a seamless, user-friendly platform. We aim to inspire and delight our customers with every click.
            </p>
            <p className="text-muted-foreground text-lg">
              We believe in the power of great products to enhance everyday life. That's why we meticulously source our items, ensuring they meet our high standards of quality, craftsmanship, and value.
            </p>
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold mb-4">Our Vision</h2>
            <p className="text-muted-foreground text-lg">
              To be the go-to online destination for shoppers seeking unique and inspiring products. We envision a world where shopping is not just a transaction, but an experience of discovery and joy.
            </p>
          </div>
        </div>

        <div>
          <h2 className="font-headline text-3xl font-bold text-center mb-8">Meet The Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="relative w-32 h-32 rounded-full mx-auto overflow-hidden">
                    <Image
                      src={`https://picsum.photos/seed/team${index + 1}/200`}
                      alt={`Team member ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="font-headline text-xl">John Doe</CardTitle>
                  <p className="text-primary">CEO & Founder</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
