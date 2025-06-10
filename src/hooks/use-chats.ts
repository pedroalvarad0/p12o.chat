import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { createChat, getChats } from "@/lib/actions/chats";
import { Chat } from "@/lib/types";

interface UseChatsOptions {
  enabled?: boolean;
}

export function useChats(options: UseChatsOptions = {}) {
  return useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: getChats,
    enabled: options.enabled ?? true, 
  });
}

export function useCreateChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createChat,
    onSuccess: (newChat) => {
      queryClient.setQueryData(['chats'], (old: Chat[]) => [newChat, ...old]);
    }
  })
}