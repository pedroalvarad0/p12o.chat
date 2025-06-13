'use client'
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { MessageList } from "./message-list";
import { ChatContentSkeleton } from "./chat-content-skeleton";
import { useMessages } from "@/hooks/use-messages";
import { useChatInputStore } from "@/lib/stores/chat-input-store";
import { useStreamingAIResponse } from "@/hooks/use-openai-stream";
import { useStreamingStore } from "@/lib/stores/streaming-store";

export function ChatContent() {
  const { chat_id } = useParams();
  const chatId = chat_id as string;
  const { model } = useChatInputStore();
  const user = useUser();
  const chats = useChats({ enabled: !!user.data });
  const messages = useMessages(chatId);
  const chat = chats.data?.find((chat) => chat.id === chatId);
  const { selectChat } = useChatStore();
  const { generateStreamingResponse } = useStreamingAIResponse();

  useEffect(() => {
    if (
      messages.data && 
      messages.data.length > 0 &&
      messages.data[messages.data.length - 1].role === "user"
    ) {
      console.log("generar ai respuesta");
      generateStreamingResponse({
        chatId,
        context: messages.data,
        model,
      }).catch(console.error);
    }
  }, [messages.data, generateStreamingResponse, chatId, model]);

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