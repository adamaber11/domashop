
import { categories } from "@/lib/data";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
          Product Categories
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Browse through our diverse range of categories to find exactly what you're looking for.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.filter(c => c !== "All").map((category) => {
          const categorySlug = category.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
          return (
            <Link href={`/category/${categorySlug}`} key={category} className="group">
              <Card className="h-full flex flex-col justify-center items-center text-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-foreground group-hover:text-primary">
                    {category}
                  </CardTitle>
                </CardHeader>
                <div className="mt-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowRight className="w-6 h-6" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
