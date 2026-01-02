'use server';
/**
 * @fileOverview A Gacha AI agent that generates a random prize.
 *
 * - generateGachaPrize - A function that handles the gacha prize generation process.
 * - GachaPrizeOutput - The return type for the generateGachaPrize function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GachaPrizeOutputSchema = z.object({
  category: z.string().describe('The category of the prize (e.g., "Pantun Lucu", "Ramalan Baik", "Nasihat Bijak", "Barang Virtual").'),
  title: z.string().describe('The title of the prize.'),
  text: z.string().describe('The descriptive text of the prize.'),
  imagePrompt: z.string().describe('A simple DALL-E 2 prompt to generate an image for the prize, in English. e.g., "A magical glowing potion bottle, digital art".'),
});
export type GachaPrizeOutput = z.infer<typeof GachaPrizeOutputSchema>;

const gachaPrizePrompt = ai.definePrompt({
  name: 'gachaPrizePrompt',
  output: { schema: GachaPrizeOutputSchema },
  prompt: `You are a fun and creative Gacha machine spirit for a farewell website. Generate a random, lighthearted, and positive "prize" for the user. The prize should be in Bahasa Indonesia.

The prize can be one of the following categories:
- Pantun Lucu: A funny four-line poem.
- Ramalan Baik: A humorous and positive fortune-telling prediction.
- Nasihat Bijak: A wise and uplifting piece of advice.
- Barang Virtual: A whimsical, imaginary virtual item.

For the imagePrompt, create a simple, descriptive prompt in English suitable for an image generation model like DALL-E 2. Make it visual and artistic.

Example Output:
{
  "category": "Pantun Lucu",
  "title": "Pantun Ikan Hiu",
  "text": "Ikan hiu makan badak, I love you mendadak!",
  "imagePrompt": "A cute shark waving, cartoon style, vibrant colors"
}
`,
});

const generateGachaPrizeFlow = ai.defineFlow(
  {
    name: 'generateGachaPrizeFlow',
    outputSchema: z.object({
      prize: GachaPrizeOutputSchema,
      imageUrl: z.string().describe("A URL of the generated image."),
    }),
  },
  async () => {
    const { output: prize } = await gachaPrizePrompt();
    if (!prize) {
        throw new Error('Failed to generate gacha prize text.');
    }

    // Use a placeholder image service instead of a generative model to avoid billing issues.
    // Use the prize title as a seed for a unique image.
    const seed = prize.title.replace(/\s+/g, '-').toLowerCase();
    const imageUrl = `https://picsum.photos/seed/${seed}/600/600`;

    return {
      prize,
      imageUrl: imageUrl,
    };
  }
);


export async function generateGachaPrize(): Promise<z.infer<typeof generateGachaPrizeFlow.outputSchema>> {
    return generateGachaPrizeFlow();
}
