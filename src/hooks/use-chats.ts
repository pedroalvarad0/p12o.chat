import { useQuery } from "@tanstack/react-query";
import { getChats } from "@/lib/actions/chats";
import { Chat } from "@/lib/types";

export function useChats() {
  return useQuery<Chat[]>({
    queryKey: ['chats'],
    queryFn: getChats,
  });
}