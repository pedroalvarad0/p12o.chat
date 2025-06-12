'use server'

import { openai } from "@/utils/openai";
import { createMessage, getMessages, updateMessage } from "./messages";
import { useMessages } from "@/hooks/use-messages";
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


export async function generateAIResponse(chatId: string, context: Message[], model: string = "gpt-4o") {
  try {
    // Filter the context to only keep role and content
    const formattedMessages = [
      systemPrompt,
      ...context.map(({ role, content }) => ({
        role: role as "user" | "assistant" | "system",
        content
      }))
    ];

    const completion = await openai.chat.completions.create({
      model: `openai/${model}`,
      messages: formattedMessages,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    const aiMessage = await createMessage(chatId, aiResponse, "assistant");

    return aiMessage;

  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function generateAIResponseStream(chatId: string, context: Message[], model: string = "gpt-4o") {
  try {
    // Filter the context to only keep role and content
    const formattedMessages = [
      systemPrompt,
      ...context.map(({ role, content }) => ({
        role: role as "user" | "assistant" | "system",
        content
      }))
    ];

    // Create an empty AI message first
    const aiMessage = await createMessage(chatId, "", "assistant");

    const completion = await openai.chat.completions.create({
      model: `openai/${model}`,
      messages: formattedMessages,
      stream: true, // Enable streaming
    });

    let fullContent = "";

    // Return a ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullContent += content;
              
              // Send the chunk to the client
              controller.enqueue(new TextEncoder().encode(JSON.stringify({
                type: 'chunk',
                content: content,
                messageId: aiMessage.id,
                fullContent: fullContent
              }) + '\n'));
              
              // Update the message in database periodically (every 10 chunks to avoid too many DB calls)
              if (fullContent.length % 50 === 0 || chunk.choices[0]?.finish_reason) {
                await updateMessage(aiMessage.id, fullContent);
              }
            }
          }
          
          // Final database update
          await updateMessage(aiMessage.id, fullContent);
          
          // Send completion signal
          controller.enqueue(new TextEncoder().encode(JSON.stringify({
            type: 'complete',
            messageId: aiMessage.id,
            fullContent: fullContent
          }) + '\n'));
          
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });

  } catch (error) {
    console.error("Error generating AI response:", error);
    throw new Error("Failed to generate AI response");
  }
}


// export async function generateAIResponse(chatId: string, userMessage: string, model: string = "gpt-4o") {
//   try {
//     // Crear el mensaje del usuario primero
//     await createMessage(chatId, userMessage, "user");

//     // Llamar a OpenAI de forma segura desde el servidor
//     const completion = await openai.chat.completions.create({
//       model: `openai/${model}`,
//       messages: [{ role: "user", content: userMessage }],
//     });

//     const aiResponse = completion.choices[0]?.message?.content;
    
//     if (!aiResponse) {
//       throw new Error("No response from AI");
//     }

//     // Guardar la respuesta de la IA
//     const aiMessage = await createMessage(chatId, aiResponse, "assistant");
//     console.log(aiMessage);
    
//     return aiMessage;
//   } catch (error) {
//     console.error("Error generating AI response:", error);
//     throw new Error("Failed to generate AI response");
//   }
// } 