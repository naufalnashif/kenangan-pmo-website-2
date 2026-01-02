import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {dev} from 'node:process';

// In development, load environment variables from a .env file
if (dev) {
  require('dotenv').config();
}

export const ai = genkit({
  plugins: [googleAI({
    apiKey: process.env.GEMINI_API_KEY,
  })],
  model: 'googleai/gemini-2.5-flash',
});
