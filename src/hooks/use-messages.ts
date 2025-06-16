import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/lib/types";
import { getMessages, createMessage, updateMessage, createFullMessage } from "@/lib/actions/messages";

export function useMessages(chatId: string) {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId),
  });
}

export function useMessageMutations() {
  const queryClient = useQueryClient();

  const createAndUpdateMessage = async (params: {
    chatId: string;
    content: string;
    role: string;
    status: string;
  }) => {
    const message = await createMessage(params.chatId, params.content, params.role, params.status);
    
    queryClient.setQueryData(['messages', params.chatId], (old: Message[] = []) => {
      return [...old, message];
    });

    return message;
  };

  const createMessageOptimistic = async (params: {
    chatId: string;
    content: string;
    role: string;
    status: string;
  }) => {
    const messageId = crypto.randomUUID();
    const now = new Date().toISOString();
    
    const optimisticMessage: Message = {
      id: messageId,
      chat_id: params.chatId,
      role: params.role,
      status: params.status,
      content: params.content,
      created_at: now,
      metadata: {},
    };

    queryClient.setQueryData(['messages', params.chatId], (old: Message[] = []) => {
      return [...old, optimisticMessage];
    });

    try {
      await createFullMessage(optimisticMessage);
      
      return optimisticMessage;
    } catch (error) {
      queryClient.setQueryData(['messages', params.chatId], (old: Message[] = []) => {
        return old.filter(msg => msg.id !== messageId);
      });
      
      throw error;
    }
  };

  const updateMessageContent = async (params: {
    messageId: string;
    content: string;
    chatId: string;
    status: string;
  }) => {
    const updatedMessage = await updateMessage(params.messageId, params.content, params.status);
    
    queryClient.setQueryData(['messages', params.chatId], (old: Message[] = []) => {
      return old.map(msg => 
        msg.id === params.messageId ? updatedMessage : msg
      );
    });

    return updatedMessage;
  };

  return {
    createAndUpdateMessage,
    createMessageOptimistic,
    updateMessageContent
  };
}