'use client'
import { useParams } from "next/navigation";
import { useEffect, useCallback } from "react";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { ChatInput } from "./chat-input";
import { MessageList } from "./message-list";
import { Suspense } from "react";
import { ChatContentSkeleton } from "./chat-content-skeleton";

export function ChatContent() {
  const { chat_id } = useParams();

  return (
    <Suspense fallback={<ChatContentSkeleton />}>
      <ChatContentClient chatId={chat_id as string} />
    </Suspense>
  );
}

function ChatContentClient({ chatId }: { chatId: string }) {
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
    <div className="flex flex-col min-h-screen">
      <MessageList chatId={chat.id} />
      <div className="sticky bottom-0 w-full">
        <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 md:px-8">
          <ChatInput location={chat.id} />
        </div>
      </div>
    </div>
  );
}