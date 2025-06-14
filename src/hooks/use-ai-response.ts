import { useMessageMutations } from "./use-messages";
import { Message } from "@/lib/types";
import { createChatCompletion } from "@/lib/actions/openai";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessage } from "@/lib/actions/messages";
import { useStreamingStore } from "@/lib/stores/streaming-store";
import { useCallback } from "react";

export function useAIResponse() {
  const { createAndUpdateMessage } = useMessageMutations();
  const { setStreaming } = useStreamingStore();
  const queryClient = useQueryClient();

  const updateMessageContent = useCallback((message: Message, content: string) => {
    queryClient.setQueryData(['messages', message.chat_id], (old: Message[] = []) => {
      return old.map(msg => 
        msg.id === message.id ? { ...msg, content } : msg
      );
    });
  }, [queryClient]);

  const shouldUpdateDatabase = useCallback((fullContent: string): boolean => {
    return fullContent.length % 100 === 0;
  }, []);

  const generateResponse = useCallback(async (chatId: string, context: Message[], model: string = "gpt-4o") => {
    setStreaming(true);

    try {
      const message = await createAndUpdateMessage({
        chatId,
        content: "",
        role: "assistant",
        status: "streaming"
      });

      const completion = await createChatCompletion(context, model);
      let fullContent = "";

      for await (const chunk of completion) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullContent += content;
          updateMessageContent(message, fullContent);

          if (shouldUpdateDatabase(fullContent)) {
            await updateMessage(message.id, fullContent, "streaming");
          }
        }
      }

      const updatedMessage = await updateMessage(message.id, fullContent, "complete");
      updateMessageContent(updatedMessage, fullContent);

      return updatedMessage;
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw error;
    } finally {
      setStreaming(false);
    }
  }, [createAndUpdateMessage, setStreaming, updateMessageContent, shouldUpdateDatabase]);

  return { generateResponse };
}