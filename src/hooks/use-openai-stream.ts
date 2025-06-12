import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/lib/types';
import { useStreamingStore } from '@/lib/stores/streaming-store';

export function useStreamingAIResponse() {
  const [isStreaming, setIsStreaming] = useState(false);
  const queryClient = useQueryClient();
  const { setStreaming, clearStreaming } = useStreamingStore();

  const generateStreamingResponse = useCallback(async ({
    chatId,
    context,
    model
  }: {
    chatId: string;
    context: Message[];
    model: string;
  }) => {
    setIsStreaming(true);
    setStreaming(chatId); // Update global streaming state
    
    try {
      const response = await fetch('/api/ai-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, context, model }),
      });

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let streamingMessage: Message | null = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'chunk') {
              // Update the streaming message in cache
              queryClient.setQueryData(['messages', chatId], (old: Message[] = []) => {
                const updatedMessages = [...old];
                
                if (!streamingMessage) {
                  // Create initial streaming message
                  streamingMessage = {
                    id: data.messageId,
                    chat_id: chatId,
                    content: data.content,
                    role: 'assistant',
                    created_at: new Date().toISOString(),
                    metadata: {}
                  };
                  updatedMessages.push(streamingMessage);
                } else {
                  // Update existing streaming message
                  const messageIndex = updatedMessages.findIndex(m => m.id === data.messageId);
                  if (messageIndex !== -1) {
                    updatedMessages[messageIndex] = {
                      ...updatedMessages[messageIndex],
                      content: data.fullContent
                    };
                  }
                }
                
                return updatedMessages;
              });
            } else if (data.type === 'complete') {
              // Final update
              queryClient.setQueryData(['messages', chatId], (old: Message[] = []) => {
                const updatedMessages = [...old];
                const messageIndex = updatedMessages.findIndex(m => m.id === data.messageId);
                if (messageIndex !== -1) {
                  updatedMessages[messageIndex] = {
                    ...updatedMessages[messageIndex],
                    content: data.fullContent
                  };
                }
                return updatedMessages;
              });
            }
          } catch (error) {
            console.error('Error parsing streaming data:', error);
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      throw error;
    } finally {
      setIsStreaming(false);
      clearStreaming(); // Clear global streaming state
    }
      }, [queryClient, setStreaming, clearStreaming]);

  return {
    generateStreamingResponse,
    isStreaming
  };
} 