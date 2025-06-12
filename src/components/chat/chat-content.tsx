'use client'
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { useMessages } from "@/hooks/use-messages";
import { ChatInput } from "./chat-input";
import { Loader2 } from "lucide-react";
import { useStreamingStore } from "@/lib/stores/streaming-store";

export function ChatContent() {
  const { data: user, isLoading: userLoading, isError: userError } = useUser();
  const { chat_id } = useParams();
  const { data: chats, isLoading: chatsLoading, error: chatsError } = useChats({ 
    enabled: !!user
  });
  const { selectedChatId, selectChat } = useChatStore();
  const chat = chats?.find((chat) => chat.id === chat_id);
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useMessages(chat_id as string);
  const { isStreaming, streamingChatId } = useStreamingStore();
  
  // Ref for the messages container to handle scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change (including streaming updates)
  useEffect(() => {
    if (messages && messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Auto-scroll during streaming for this specific chat
  useEffect(() => {
    if (isStreaming && streamingChatId === chat_id) {
      scrollToBottom();
      
      // Set up interval to continuously scroll during streaming
      const scrollInterval = setInterval(() => {
        scrollToBottom();
      }, 100); // Scroll every 100ms during streaming
      
      return () => clearInterval(scrollInterval);
    }
  }, [isStreaming, streamingChatId, chat_id]);

  // Scroll to bottom when entering a chat for the first time
  useEffect(() => {
    if (!messagesLoading && messages && messages.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(scrollToBottom, 100);
    }
  }, [chat_id, messagesLoading]);

  useEffect(() => {
    if (!chatsLoading && !chatsError && chats && chats.length > 0) {
        const chatExists = chats.some((chat) => chat.id === chat_id);
        if (chatExists) {
            selectChat(chat_id as string);
        } 
    }
  }, [chat_id, chats, chatsLoading, chatsError, selectChat]);

  if (userLoading || chatsLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (userError || chatsError || messagesError) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Error loading chat</div>
      </div>
    );
  }

  if (!chat || !user) {
    redirect('/');
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div 
        ref={messagesContainerRef}
        className="flex-1 w-full max-w-4xl mx-auto px-3 mt-8 sm:px-6 md:px-8 py-4 overflow-y-auto"
      >
        <div className="flex flex-col gap-4">
          {messages?.map((message) => (
            <div key={message.id} className="flex flex-col gap-2">
              <div className={`p-3 rounded-lg max-w-[80%] ${
                message.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-muted'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          
          {/* Streaming indicator */}
          {/* {isStreaming && streamingChatId === chat_id && (
            <div className="flex flex-col gap-2">
              <div className="bg-muted p-3 rounded-lg max-w-[80%]">
                <div className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  <span className="text-muted-foreground">Generando respuesta...</span>
                </div>
              </div>
            </div>
          )} */}
          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 w-full">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 md:px-8">
          <ChatInput location={chat.id} />
        </div>
      </div>
    </div>
  )
}