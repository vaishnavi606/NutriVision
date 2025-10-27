import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import { configureGenkit } from '@genkit-ai/core';
import { googleGenAI } from '@genkit-ai/google-genai';
import { defineFlow } from '@genkit-ai/flow';
import { gemini25Flash } from '@genkit-ai/google-genai';
import * as z from 'zod';

export default configureGenkit({
  plugins: [
    googleGenAI({
      // An API key is required for gemini-2.5-flash.
      // Pass it in explicitly or set the GOOGLE_GENAI_API_KEY environment variable.
      // apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export const streamingPoemFlow = defineFlow(
  {
    name: 'streamingPoemFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
    stream: true,
  },
  async (topic, streamingCallback) => {
    const stream = await gemini25Flash.generate({
      prompt: `Write a short, creative poem about the following topic: ${topic}. Return the poem line by line.`,
      streaming: true,
    });

    for await (const chunk of stream) {
      streamingCallback(chunk.text());
    }
  }
);

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.5-flash',
});
