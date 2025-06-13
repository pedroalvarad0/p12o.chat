import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Message } from '@/lib/types';
import { useStreamingStore } from '@/lib/stores/streaming-store';

export function useStreamingAIResponse() {
  const queryClient = useQueryClient();
  const { setStreaming } = useStreamingStore();

  const generateStreamingResponse = useCallback(async ({
    chatId,
    context,
    model
  }: {
    chatId: string;
    context: Message[];
    model: string;
  }) => {
    setStreaming(chatId);
    
    try {
      const response = await fetch('/api/ai-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, context, model }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let currentMessageId: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            
            if (data.type === 'chunk') {
              currentMessageId = data.messageId;
              
              queryClient.setQueryData(['messages', chatId], (old: Message[] = []) => {
                const existingMessageIndex = old.findIndex(m => m.id === data.messageId);
                
                if (existingMessageIndex === -1) {
                  // Create new message
                  return [...old, {
                    id: data.messageId,
                    chat_id: chatId,
                    content: data.fullContent,
                    role: 'assistant',
                    created_at: new Date().toISOString(),
                    metadata: {}
                  }];
                } else {
                  // Update existing message
                  const updatedMessages = [...old];
                  updatedMessages[existingMessageIndex] = {
                    ...updatedMessages[existingMessageIndex],
                    content: data.fullContent
                  };
                  return updatedMessages;
                }
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
      setStreaming(null);
    }
  }, [queryClient, setStreaming]);

  return { generateStreamingResponse };
} 