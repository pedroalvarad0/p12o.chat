import { generateAIResponseStream } from '@/lib/actions/openai';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { chatId, context, model } = await request.json();
    
    return await generateAIResponseStream(chatId, context, model);
  } catch (error) {
    console.error('Streaming API error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
} 