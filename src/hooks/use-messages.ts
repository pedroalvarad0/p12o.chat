import { createMessage, getMessages } from "@/lib/actions/messages";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Message } from "@/lib/types";

export function useMessages(chatId: string) {
    return useQuery<Message[]>({
        queryKey: ['messages', chatId],
        queryFn: () => getMessages(chatId),
    })
}

export function useCreateMessage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({chatId, content, role}: {chatId: string, content: string, role: string}) => 
            createMessage(chatId, content, role),
        onSuccess: (_, variables) => {
            queryClient.setQueryData(['messages', variables.chatId], (old: Message[]) => [...old, _]);
        }
    })
}