import { OpenAI } from "openai";


export function createOpenAIClient(apiKey?: string) {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: apiKey || process.env.OPENROUTER_API_KEY,
  });
}

export const openai = createOpenAIClient();