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
  rarity: z.enum(['Common', 'Rare', 'Epic', 'Super Epic']).describe('The rarity of the prize.'),
});
export type GachaPrizeOutput = z.infer<typeof GachaPrizeOutputSchema>;

const GachaInputSchema = z.object({
  userId: z.string().describe("A unique anonymous identifier for the user."),
});

const gachaPrizePrompt = ai.definePrompt({
  name: 'gachaPrizePrompt',
  output: { schema: GachaPrizeOutputSchema.omit({ rarity: true }) }, // AI doesn't generate rarity
  prompt: `You are a fun, creative, and slightly dramatic Gacha machine spirit for a farewell website. Your task is to generate a truly unique, creative, and high-quality "prize" for the user that feels "Super Epic". The prize must be in Bahasa Indonesia.

The prize must be one of the following categories, but make it sound legendary:
- Pantun Lucu: A hilarious and clever four-line poem.
- Ramalan Baik: A humorous and surprisingly deep positive fortune-telling prediction.
- Nasihat Bijak: A wise and profoundly uplifting piece of advice.
- Barang Virtual: A whimsical, imaginary virtual item with a funny, epic description.
- Tebak-tebakan: A very clever riddle and its answer. Format as "Tebakan: [riddle] Jawaban: [answer]".
- Ramalan Jodoh: A lighthearted, funny, and specific love life prediction.
- Ramalan Hari Ini: A positive and humorous prediction for the user's day that is unexpectedly accurate.

For the imagePrompt, create a simple, but epic and descriptive prompt in English suitable for an image generation model. Make it visual, artistic, and worthy of a "Super Epic" prize.

Example "Super Epic" Output (for Barang Virtual):
{
  "category": "Barang Virtual",
  "title": "Voucher Cuti Tak Terbatas",
  "text": "Sebuah artefak legendaris yang konon bisa digunakan untuk cuti kapan saja, di dimensi mana saja. Efek samping: dikejar HR lintas realita.",
  "imagePrompt": "A glowing golden ticket that says 'UNLIMITED LEAVE' radiating cosmic energy, fantasy digital art"
}

Example "Super Epic" Output (for Nasihat Bijak):
{
  "category": "Nasihat Bijak",
  "title": "Petuah dari Kucing Oren Galaksi",
  "text": "Hiduplah seperti kucing oren antar-dimensi: berani, sedikit bar-bar, melanggar hukum fisika, dan selalu dicintai apapun yang terjadi.",
  "imagePrompt": "An orange cat wearing a superhero cape, floating in a colorful galaxy, looking confident, epic cartoon style"
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
          // Add rarity to the AI-generated prize
          prize = { ...aiPrize, rarity: 'Super Epic' };
          isAiGenerated = true;
          console.log('AI prize generated successfully.');
          
          const seed = prize.title.replace(/\s+/g, '-').toLowerCase();
          imageUrl = `https://picsum.photos/seed/${seed}/600/400`;

        } else {
           console.log('AI failed to generate a prize, falling back to offline prize.');
        }
      } catch (e: any) {
        console.warn("AI prize generation failed, falling back to offline prize. Error:", e.message);
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
