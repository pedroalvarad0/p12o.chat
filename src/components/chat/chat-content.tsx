'use client'
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

export function ChatContent() {
  const { data: user } = useUser();
  const { chat_id } = useParams();
  const { data: chats, isLoading, error } = useChats({ 
    enabled: !!user
  });
  const { selectedChatId, selectChat } = useChatStore();

  if (!user) {
    redirect('/');
  }

  useEffect(() => {
    if (!isLoading && !error && chats && chats.length > 0) {
        const chatExists = chats.some((chat) => chat.id === chat_id);
        if (chatExists) {
            selectChat(chat_id as string);
        } 
    }
  }, [chat_id, chats, isLoading, error, selectChat]);

  return (
    <div>
      <h1>Chat content</h1>
      <p>Chat ID: {chat_id}</p>
    </div>
  )
}