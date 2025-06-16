'use server';

import { OpenAI } from "openai";

export async function validateOpenRouterApiKey(apiKey: string): Promise<boolean> {
  try {
    const client = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: apiKey,
    });
    
    await client.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: "Hello, how are you?" }],
    });
    
    return true;
  } catch (error) {
    console.error('API key validation failed:', error);
    return false;
  }
} 