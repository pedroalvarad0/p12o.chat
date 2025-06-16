'use server'

import { openai, createOpenAIClient } from "@/utils/openai";
import { Message } from "../types";

const systemPrompt = {
  role: "system" as const,
  content: `
You are a conversational assistant with the following capabilities:
- Complete memory of the entire conversation
- Can reference specific messages by number or content
- Maintain context between related questions
- If you don't understand something, ask for clarification
`};

const titlePrompt = {
  role: "system" as const,
  content: `
You generate SHORT chat titles. Follow these rules STRICTLY:

1. Maximum 6 words
2. No quotes, no punctuation
3. Use simple, clear words
4. Be specific but concise
5. Return "null" if message is too vague

GOOD examples:
"How do I cook pasta?" → "Pasta Cooking Help Guide"
"Python vs JavaScript performance" → "Python vs JavaScript Performance"
"What is machine learning?" → "Machine Learning Introduction"
"Fix my CSS layout problem" → "CSS Layout Problem Fix"
"Tell me about cats behavior" → "Cat Behavior Information"
"How to learn React hooks?" → "React Hooks Learning Guide" 

BAD examples (don't do this):
"How to Learn Programming Languages Effectively and Efficiently" (too long)
"Help with Various Programming Issues and Questions" (too generic and long)
"Cooking and Recipe Questions for Beginners" (too broad)

Return "null" for:
- Greetings like "hi", "hello"
- Single words like "help"
- Very generic requests

Be direct and concise.
  `
}

export async function createChatCompletion(context: Message[], model: string = "openai/gpt-4o", userApiKey?: string) {
  try {
    const client = createOpenAIClient(userApiKey);
    
    const formattedMessages = [
      systemPrompt,
      ...context.map(({ role, content }) => ({
        role: role as "user" | "assistant" | "system",
        content
      }))
    ];

    return client.chat.completions.create({
      model: model,
      messages: formattedMessages,
      stream: true
    });
  } catch (error) {
    console.error("Error creating chat completion:", error);
    
    if (error instanceof Error && 'status' in error && error.status === 401) {
      throw new Error("Invalid API key. Please check your OpenRouter API key.");
    }
    
    throw new Error("Failed to create chat completion");
  }
}

export async function generateChatTitle(userMessage: string): Promise<string | null> {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      messages: [
        titlePrompt,
        {
          role: "user", 
          content: userMessage
        }
      ],
      temperature: 0.3,
      max_tokens: 20
    });

    const title = completion.choices[0]?.message?.content?.trim();
    
    if (!title || title.toLowerCase() === 'null' || title.length < 3) {
      return null;
    }

    const wordCount = title.split(' ').length;
    if (wordCount > 6) {
      console.log(`Title too long (${wordCount} words): ${title}`);
      return null;
    }

    return title;
  } catch (error) {
    console.error('Error generating chat title:', error);
    return null;
  }
}

