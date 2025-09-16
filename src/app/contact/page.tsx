// src/app/contact/page.tsx
'use server';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPagesContent } from '@/lib/services/pages-service';
import { ContactForm } from './_components/contact-form';
import { Phone, Mail } from 'lucide-react';

export default async function ContactPage() {
  const { contact } = await getPagesContent();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">
          {contact.headline}
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {contact.subheading}
        </p>
      </div>

      <div className="mt-16 grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Phone className="w-8 h-8 text-primary" />
              <CardTitle className="font-headline">Call Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{contact.phone}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Mail className="w-8 h-8 text-primary" />
              <CardTitle className="font-headline">Email Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{contact.email}</p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Send a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <ContactForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
