'use server'

import { openai } from "@/utils/openai";
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

export async function createChatCompletion(context: Message[], model: string = "gpt-4o") {
  try {
    const formattedMessages = [
      systemPrompt,
      ...context.map(({ role, content }) => ({
        role: role as "user" | "assistant" | "system",
        content
      }))
    ];

    return openai.chat.completions.create({
      model: `openai/${model}`,
      messages: formattedMessages,
      stream: true
    });
  } catch (error) {
    console.error("Error creating chat completion:", error);
    throw new Error("Failed to create chat completion");
  }
}