"use client";

import { useMessages } from "@/hooks/use-messages";
import { ChatMessage } from "./chat-message";
import { useStreamingStore } from "@/lib/stores/streaming-store";
import { ChatContentSkeleton } from "./chat-content-skeleton";
import { useEffect, useRef } from "react";

interface MessageListProps {
  chatId: string;
}

export function MessageList({ chatId }: MessageListProps) {
  const messages = useMessages(chatId);
  const { isStreaming, isWaitingCompletion } = useStreamingStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages are loaded
  useEffect(() => {
    if (!messages.isLoading && messages.data) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [messages.isLoading, messages.data]);

  if (messages.isLoading) {
    return <ChatContentSkeleton />;
  }

  if (messages.isError) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Error loading messages</div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 w-full max-w-4xl mx-auto px-3 mt-8 sm:px-6 md:px-8 py-4 overflow-y-auto"
    >
      <div className="flex flex-col">
        {messages.data?.map((message, index) => {
          // Check if this is the last message and if it's currently being streamed
          const isLastMessage = index === messages.data.length - 1;
          const isStreamingThisMessage = isStreaming &&
            message.role === 'assistant' &&
            isLastMessage;

          return (
            <ChatMessage
              key={message.id}
              message={message}
              isStreaming={isStreamingThisMessage}
              isWaitingCompletion={isWaitingCompletion}
              isLastMessage={isLastMessage}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}