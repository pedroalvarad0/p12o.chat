import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useUser } from "./use-user";
import { Chat, Message } from "@/lib/types";
import { createFullChat } from "@/lib/actions/chats";
import { createFullMessage } from "@/lib/actions/messages";
import { toast } from "sonner";

export function useOptimisticChatCreation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const user = useUser();

  return useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      const chatId = crypto.randomUUID();
      const messageId = crypto.randomUUID();
      const now = new Date().toISOString();

      const optimisticChat: Chat = {
        id: chatId,
        name: "New Chat",
        user_id: user.data?.id ?? "", // change this
        updated_at: now
      };

      const optimisticMessage: Message = {
        id: messageId,
        chat_id: chatId,
        role: "user",
        status: "complete",
        content,
        created_at: now,
        metadata: {}
      };

      // 1. update cache optimistically
      queryClient.setQueryData(['chats'], (old: Chat[]) => [optimisticChat, ...old]);
      queryClient.setQueryData(['messages', chatId], [optimisticMessage]);

      // 2. navigate to new chat
      router.push(`/chat/${chatId}`);

      try {
        await Promise.all([
          createFullChat(optimisticChat),
          createFullMessage(optimisticMessage)
        ]);

        return { chat: optimisticChat, message: optimisticMessage };
      } catch (error) {
        // rollback cache
        queryClient.setQueryData(['chats'], (old: Chat[]) =>
          old.filter((chat) => chat.id !== chatId)
        );
        queryClient.setQueryData(['messages', chatId], (old: Message[]) => old.filter((message) => message.id !== messageId));
        //queryClient.removeQueries({ queryKey: ['messages', chatId] });

        router.replace('/');
        toast.error("Failed to create chat");
        throw error;
      }
    }
  })
}