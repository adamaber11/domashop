// src/ai/flows/personalized-product-recommendations.ts
'use server';

/**
 * @fileOverview Provides personalized product recommendations based on user history.
 *
 * - getPersonalizedRecommendations - A function that generates product recommendations.
 * - PersonalizedRecommendationsInput - The input type for the getPersonalizedRecommendations function.
 * - PersonalizedRecommendationsOutput - The return type for the getPersonalizedRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  browsingHistory: z
    .string()
    .describe('The user browsing history, as a string of product IDs.'),
  purchaseHistory: z
    .string()
    .describe('The user purchase history, as a string of product IDs.'),
  numberOfRecommendations: z
    .number()
    .default(5)
    .describe('The number of product recommendations to return.'),
});
export type PersonalizedRecommendationsInput = z.infer<
  typeof PersonalizedRecommendationsInputSchema
>;

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z
    .array(z.string())
    .describe('An array of product IDs that are recommended for the user.'),
});
export type PersonalizedRecommendationsOutput = z.infer<
  typeof PersonalizedRecommendationsOutputSchema
>;

export async function getPersonalizedRecommendations(
  input: PersonalizedRecommendationsInput
): Promise<PersonalizedRecommendationsOutput> {
  return personalizedRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  input: {schema: PersonalizedRecommendationsInputSchema},
  output: {schema: PersonalizedRecommendationsOutputSchema},
  prompt: `You are an expert e-commerce product recommendation engine.

  Based on the user's browsing history: {{{browsingHistory}}} and purchase history: {{{purchaseHistory}}},
  recommend {{{numberOfRecommendations}}} relevant product IDs that the user might be interested in.
  Do not include any products that are already in the user's purchase history.

  Return the product IDs as a JSON array.
  `,
});

const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: PersonalizedRecommendationsInputSchema,
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
