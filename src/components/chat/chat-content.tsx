'use client'
import { useParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { MessageList } from "./message-list";
import { ChatContentSkeleton } from "./chat-content-skeleton";
import { useMessages } from "@/hooks/use-messages";
import { useStreamingStore } from "@/lib/stores/streaming-store";
import { useAIResponse } from "@/hooks/use-ai-response";
import { useAutoRenameChat } from "@/hooks/use-auto-rename-chat";
import { useModelStore } from "@/lib/stores/model-store";
import { toast } from "sonner";

export function ChatContent() {
  const { chat_id } = useParams();
  const chatId = chat_id as string;
  const { model } = useModelStore();
  const user = useUser();
  const chats = useChats({ enabled: !!user.data });
  const messages = useMessages(chatId);
  const chat = chats.data?.find((chat) => chat.id === chatId);
  const { selectChat } = useChatStore();
  const { isStreaming } = useStreamingStore();
  const { generateResponse } = useAIResponse();
  
  const lastProcessedMessageRef = useRef<string | null>(null);

  //console.log(messages.data);

  useAutoRenameChat({
    chatId,
    chat,
    messages: messages.data,
    isStreaming
  });

  useEffect(() => {
    const lastMessage = messages.data?.[messages.data.length - 1];
    
    if (lastMessage?.role === "user" && messages.data && !isStreaming) {
      if (lastProcessedMessageRef.current === lastMessage.id) {
        return;
      }
      
      lastProcessedMessageRef.current = lastMessage.id;
      
      generateResponse(chatId, messages.data, model)
        .catch(error => {
          toast.error(error.message);
          console.error('Error generating AI response:', error);
          
          lastProcessedMessageRef.current = null;
        });
    }
  }, [messages.data, isStreaming, chatId, model, generateResponse]);

  useEffect(() => {
    if (!chats.isLoading && !chats.isError && chats.data && chats.data.length > 0) {
      const chatExists = chats.data.some((chat) => chat.id === chatId);
      if (chatExists) {
        selectChat(chatId);
      }
    }
  }, [chatId, chats.data, chats.isLoading, chats.isError, selectChat]);

  if (user.isLoading || chats.isLoading) {
    return <ChatContentSkeleton />;
  }

  if (user.isError || chats.isError) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Error loading chat</div>
      </div>
    );
  }

  if (!chat || !user.data) {
    redirect('/');
  }

  return (
    <MessageList chatId={chat.id} />
  );
}