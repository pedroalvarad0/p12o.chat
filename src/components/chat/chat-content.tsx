'use client'
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import { useMessages } from "@/hooks/use-messages";
import { ChatInput } from "./chat-input";

export function ChatContent() {
  const { data: user } = useUser();
  const { chat_id } = useParams();
  const { data: chats, isLoading, error } = useChats({ 
    enabled: !!user
  });
  const { selectedChatId, selectChat } = useChatStore();
  const chat = chats?.find((chat) => chat.id === chat_id);
  const { data: messages, isLoading: messagesLoading, error: messagesError } = useMessages(chat_id as string);

  if (!user || !chat) {
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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 w-full max-w-4xl mx-auto px-3 mt-8 sm:px-6 md:px-8 py-4">
        <div className="flex flex-col gap-2">
          {messages?.map((message) => (
            <div key={message.id}>
              <p>{message.content}</p>
            </div>
          ))}
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