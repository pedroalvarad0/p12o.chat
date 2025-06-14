import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Message } from "@/lib/types";
import { getMessages, createMessage, updateMessage } from "@/lib/actions/messages";

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
    // Crear mensaje en la base de datos
    const message = await createMessage(params.chatId, params.content, params.role, params.status);
    
    // Actualizar caché
    queryClient.setQueryData(['messages', params.chatId], (old: Message[] = []) => {
      return [...old, message];
    });

    return message;
  };

  const updateMessageContent = async (params: {
    messageId: string;
    content: string;
    chatId: string;
    status: string;
  }) => {
    // Actualizar en la base de datos
    const updatedMessage = await updateMessage(params.messageId, params.content, params.status);
    
    // Actualizar caché
    queryClient.setQueryData(['messages', params.chatId], (old: Message[] = []) => {
      return old.map(msg => 
        msg.id === params.messageId ? updatedMessage : msg
      );
    });

    return updatedMessage;
  };

  return {
    createAndUpdateMessage,
    updateMessageContent
  };
}