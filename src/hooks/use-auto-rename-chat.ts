import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { generateChatTitle } from '@/lib/actions/openai';
import { renameChat } from '@/lib/actions/chats';
import { Chat, Message } from '@/lib/types';

interface UseAutoRenameChatProps {
  chatId: string;
  chat: Chat | undefined;
  messages: Message[] | undefined;
  isStreaming: boolean;
}

export function useAutoRenameChat({ 
  chatId, 
  chat, 
  messages, 
  isStreaming 
}: UseAutoRenameChatProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!messages || !chat || isStreaming) return;

    const handleAutoRename = async (userMessage: string) => {
      try {
        const title = await generateChatTitle(userMessage);
        
        if (title) {
          await renameChat(chatId, title);
          
          queryClient.setQueryData(['chats'], (old: Chat[] = []) => 
            old.map(chat => 
              chat.id === chatId ? { ...chat, name: title } : chat
            )
          );
        }
      } catch (error) {
        console.error('Error in auto-rename process:', error);
      }
    };

    const lastMessage = messages[messages.length - 1];
    
    if (lastMessage?.role === "user" && chat.name === "New Chat") {
      handleAutoRename(lastMessage.content);
    }
  }, [messages, chat, isStreaming, chatId, queryClient]);

  
} 