'use server';
/**
 * @fileOverview A Gacha AI agent that generates a random prize, with a fallback to offline prizes.
 *
 * - generateGachaPrize - A function that handles the gacha prize generation process.
 * - GachaPrizeOutput - The return type for the prize object.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { offlinePrizes } from '@/lib/offline-prizes';

const GachaPrizeOutputSchema = z.object({
  category: z.string().describe('The category of the prize (e.g., "Pantun Lucu", "Ramalan Jodoh", "Tebak-tebakan", "Barang Virtual").'),
  title: z.string().describe('The title of the prize.'),
  text: z.string().describe('The descriptive text of the prize.'),
  imagePrompt: z.string().describe('A simple DALL-E 2 prompt to generate an image for the prize, in English. e.g., "A magical glowing potion bottle, digital art".'),
});
export type GachaPrizeOutput = z.infer<typeof GachaPrizeOutputSchema>;

const GachaInputSchema = z.object({
  userId: z.string().describe("A unique anonymous identifier for the user."),
});

const gachaPrizePrompt = ai.definePrompt({
  name: 'gachaPrizePrompt',
  output: { schema: GachaPrizeOutputSchema },
  prompt: `You are a fun and creative Gacha machine spirit for a farewell website. Generate a random, lighthearted, and positive "prize" for the user. The prize must be in Bahasa Indonesia.

The prize can be one of the following categories:
- Pantun Lucu: A funny four-line poem.
- Ramalan Baik: A humorous and positive general fortune-telling prediction.
- Nasihat Bijak: A wise and uplifting piece of advice.
- Barang Virtual: A whimsical, imaginary virtual item with a funny description.
- Tebak-tebakan: A funny riddle and its answer. Format as "Tebakan: [riddle] Jawaban: [answer]".
- Ramalan Jodoh: A lighthearted and funny love life prediction.
- Ramalan Hari Ini: A positive and humorous prediction for the user's day.

For the imagePrompt, create a simple, descriptive prompt in English suitable for an image generation model like DALL-E 2. Make it visual and artistic.

Example Output (for Tebak-tebakan):
{
  "category": "Tebak-tebakan",
  "title": "Tebakan Hewan",
  "text": "Tebakan: Hewan apa yang paling kaya? Jawaban: Ber-uang.",
  "imagePrompt": "A cute cartoon bear holding a bag of money, vibrant colors"
}

Example Output (for Ramalan Jodoh):
{
  "category": "Ramalan Jodoh",
  "title": "Prediksi Cinta Hari Ini",
  "text": "Sepertinya hari ini kamu akan bertemu seseorang yang senyumnya semanis martabak keju. Jangan lupa sikat gigi!",
  "imagePrompt": "Two cute cartoon characters smiling at each other with a giant sweet cake between them, romantic comedy style"
}
`,
});


// Helper function to get a random offline prize
const getRandomOfflinePrize = (): GachaPrizeOutput => {
  const randomIndex = Math.floor(Math.random() * offlinePrizes.length);
  return offlinePrizes[randomIndex];
};

const generateGachaPrizeFlow = ai.defineFlow(
  {
    name: 'generateGachaPrizeFlow',
    inputSchema: GachaInputSchema,
    outputSchema: z.object({
      prize: GachaPrizeOutputSchema.optional(),
      imageUrl: z.string().describe("A URL of the generated image.").optional(),
      error: z.string().optional(),
      isAiGenerated: z.boolean().optional(),
    }),
  },
  async ({ userId }) => {
    // 25% chance to try and get a prize from the AI
    const shouldUseAI = Math.random() < 0.25;
    let prize: GachaPrizeOutput | null = null;
    let isAiGenerated = false;
    let imageUrl: string | undefined = '';

    if (shouldUseAI) {
      console.log('Attempting to generate prize with AI...');
      try {
        const { output: aiPrize } = await gachaPrizePrompt();
        if (aiPrize) {
          prize = aiPrize;
          isAiGenerated = true;
          console.log('AI prize generated successfully.');
          
          // Use picsum for AI-generated prizes as well, to avoid costs and potential errors.
          const seed = prize.title.replace(/\s+/g, '-').toLowerCase();
          imageUrl = `https://picsum.photos/seed/${seed}/600/400`;

        } else {
           console.log('AI failed to generate a prize, falling back to offline prize.');
        }
      } catch (e: any) {
        console.warn("AI prize generation failed, falling back to offline prize. Error:", e.message);
        // If AI fails for any reason (e.g., rate limit), we just fall through and use an offline prize.
      }
    }

    // If AI was not used, or if it failed, get an offline prize.
    if (!prize) {
        prize = getRandomOfflinePrize();
        isAiGenerated = false;
        const seed = prize.title.replace(/\s+/g, '-').toLowerCase();
        imageUrl = `https://picsum.photos/seed/${seed}/600/400`;
    }
    
    if (!prize) {
      return { error: 'Gagal menghasilkan hadiah dari sumber manapun.' };
    }
    
    return {
      prize,
      imageUrl,
      isAiGenerated,
    };
  }
);


export async function generateGachaPrize(input: z.infer<typeof GachaInputSchema>): Promise<z.infer<typeof generateGachaPrizeFlow.outputSchema>> {
    return generateGachaPrizeFlow(input);
}
