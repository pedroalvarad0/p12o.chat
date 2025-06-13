'use client'
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { MessageList } from "./message-list";
import { ChatContentSkeleton } from "./chat-content-skeleton";

export function ChatContent() {
  const { chat_id } = useParams();
  const chatId = chat_id as string;
  const user = useUser();
  const chats = useChats({ enabled: !!user.data });
  const chat = chats.data?.find((chat) => chat.id === chatId);
  const { selectChat } = useChatStore();

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