'use server';
/**
 * @fileOverview Generates a summary of product reviews using AI.
 *
 * - summarizeProductReviews - A function that takes product reviews as input and returns a summary.
 * - SummarizeProductReviewsInput - The input type for the summarizeProductReviews function.
 * - SummarizeProductReviewsOutput - The return type for the summarizeProductReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeProductReviewsInputSchema = z.object({
  productReviews: z
    .string()
    .describe('The reviews for the product to be summarized.'),
});

export type SummarizeProductReviewsInput = z.infer<
  typeof SummarizeProductReviewsInputSchema
>;

const SummarizeProductReviewsOutputSchema = z.object({
  summary: z.string().describe('The AI-generated summary of the product reviews.'),
});

export type SummarizeProductReviewsOutput = z.infer<
  typeof SummarizeProductReviewsOutputSchema
>;

export async function summarizeProductReviews(
  input: SummarizeProductReviewsInput
): Promise<SummarizeProductReviewsOutput> {
  return summarizeProductReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeProductReviewsPrompt',
  input: {schema: SummarizeProductReviewsInputSchema},
  output: {schema: SummarizeProductReviewsOutputSchema},
  prompt: `Summarize the following product reviews, highlighting the main positive and negative points:\n\n{{{productReviews}}}`,
});

const summarizeProductReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeProductReviewsFlow',
    inputSchema: SummarizeProductReviewsInputSchema,
    outputSchema: SummarizeProductReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
