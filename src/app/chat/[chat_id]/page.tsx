'use client'

import { ChatContent } from "@/components/chat/chat-content";
import { useChatStore } from "@/lib/stores/chat-store";
import { useParams } from 'next/navigation'
import { useChats } from "@/hooks/use-chats";
import { useEffect } from "react";

export default function ChatPage() {
  const { chat_id } = useParams();
  const { data: chats, isLoading, error } = useChats(); 
  const { selectedChatId, selectChat } = useChatStore();

  useEffect(() => {
    if (!isLoading && !error && chats && chats.length > 0) {
        const chatExists = chats.some((chat) => chat.id === chat_id);
        if (chatExists) {
            selectChat(chat_id as string);
        } 
    }
  }, [chat_id, chats, isLoading, error, selectChat]);

  return (  
    <ChatContent />
  )
}