import { useQuery } from "@tanstack/react-query";
import { getChats } from "@/lib/actions/chats";
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