"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { StarRatingInput } from './star-rating-input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating"),
  text: z.string().min(10, "Review must be at least 10 characters long."),
});


export function AddReviewForm({ productId }: { productId: string }) {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [showForm, setShowForm] = useState(false);

    const form = useForm<z.infer<typeof reviewSchema>>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            text: '',
        },
    });

    const onSubmit = (values: z.infer<typeof reviewSchema>) => {
        // TODO: Replace with API call to submit the review
        console.log('New review submitted:', { productId, userId: user?.uid, ...values });
        toast({
            title: "Review Submitted!",
            description: "Thank you for your feedback. Your review has been submitted for approval.",
        });
        form.reset();
        setShowForm(false);
    };

    if (loading) {
      return null; // or a skeleton loader
    }

    if (!user) {
        return (
            <Card className="bg-muted/30">
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                        You must be <a href="/login" className="text-primary underline">logged in</a> to write a review.
                    </p>
                </CardContent>
            </Card>
        )
    }

    if (!showForm) {
        return (
            <div className="text-center">
                <Button onClick={() => setShowForm(true)}>Write a Review</Button>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Write your review</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Rating</FormLabel>
                                    <FormControl>
                                        <StarRatingInput value={field.value} onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Your Review</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Share your thoughts on the product..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end gap-2">
                             <Button type="button" variant="ghost" onClick={() => { form.reset(); setShowForm(false); }}>Cancel</Button>
                             <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
