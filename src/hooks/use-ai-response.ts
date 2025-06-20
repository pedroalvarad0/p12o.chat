import { useMessageMutations } from "./use-messages";
import { Message } from "@/lib/types";
import { createChatCompletion } from "@/lib/actions/openai";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessage } from "@/lib/actions/messages";
import { useStreamingStore } from "@/lib/stores/streaming-store";
import { useCallback, useRef, useEffect } from "react";
import { getOpenRouterModelName, isThinkingModel } from "@/utils/models";
import { useOpenRouterApiKey, getOpenRouterApiKey } from './use-openrouter-api-key';

export function useAIResponse() {
  const { createAndUpdateMessage } = useMessageMutations();
  const { isStreaming, setStreaming, setWaitingCompletion, setThinking } = useStreamingStore();
  const { apiKey } = useOpenRouterApiKey();
  const queryClient = useQueryClient();
  const streamingRef = useRef(isStreaming);

  useEffect(() => {
    streamingRef.current = isStreaming;
  }, [isStreaming]);

  const updateMessageContent = useCallback((message: Message, content: string) => {
    queryClient.setQueryData(['messages', message.chat_id], (old: Message[] = []) => {
      return old.map(msg => 
        msg.id === message.id ? { ...msg, content } : msg
      );
    });
  }, [queryClient]);

  // const shouldUpdateDatabase = useCallback((fullContent: string): boolean => {
  //   return fullContent.length % 100 === 0;
  // }, []);

  const generateResponse = useCallback(async (chatId: string, context: Message[], model: string = "GPT-4o") => {
    const currentApiKey = getOpenRouterApiKey();
    
    if (!currentApiKey && !process.env.OPENROUTER_API_KEY) {
      throw new Error("No API key available. Please configure your OpenRouter API key in the sidebar.");
    }

    setStreaming(true);
    setWaitingCompletion(true);

    try {
      const message = await createAndUpdateMessage({
        chatId,
        content: "",
        role: "assistant",
        status: "streaming"
      });

      const modelWithProvider = getOpenRouterModelName(model);
      const completion = await createChatCompletion(context, modelWithProvider, currentApiKey || undefined);

      setWaitingCompletion(false);

      if (isThinkingModel(model)) {
        setThinking(true);
      }

      let fullContent = "";
      let firstChunkReceived = false;

      for await (const chunk of completion) {

        if (!streamingRef.current) {
          const updatedMessage = await updateMessage(message.id, fullContent, "complete");
          updateMessageContent(updatedMessage, fullContent);
          return updatedMessage;
        }

        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          if (!firstChunkReceived && isThinkingModel(model)) {
            setThinking(false);
            firstChunkReceived = true;
          }
          
          fullContent += content;
          updateMessageContent(message, fullContent);

          // if (shouldUpdateDatabase(fullContent)) {
          //   await updateMessage(message.id, fullContent, "streaming");
          // }
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
      setWaitingCompletion(false);
      setThinking(false);
    }
  }, [createAndUpdateMessage, setStreaming, setWaitingCompletion, updateMessageContent, setThinking]);

  return { 
    generateResponse, 
    hasApiKey: !!apiKey || !!process.env.OPENROUTER_API_KEY 
  };
}