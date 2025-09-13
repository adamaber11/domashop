'use client';

import { useState } from 'react';
import { summarizeProductReviews } from '@/ai/flows/ai-product-review-summary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, AlertTriangle } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import type { Review } from '@/lib/types';

interface AIReviewSummaryProps {
  reviews: Review[];
}

export default function AIReviewSummary({ reviews }: AIReviewSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (reviews.length === 0) {
        setSummary("There are no reviews to summarize.");
        return;
    }
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const reviewText = reviews.map(r => `Rating: ${r.rating}/5 - "${r.text}"`).join('\n');
      const result = await summarizeProductReviews({ productReviews: reviewText });
      setSummary(result.summary);
    } catch (e) {
      setError('Failed to generate summary. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-muted/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-headline text-2xl">AI Review Summary</CardTitle>
        <Button onClick={handleSummarize} disabled={isLoading}>
          <Wand2 className="mr-2 h-4 w-4" />
          {summary ? 'Regenerate' : 'Generate'} Summary
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        )}
        {error && (
            <div className="text-destructive flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                <p>{error}</p>
            </div>
        )}
        {summary && <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>}
        {!summary && !isLoading && !error && (
            <p className="text-muted-foreground">Click the button to generate an AI-powered summary of all reviews.</p>
        )}
      </CardContent>
    </Card>
  );
}
