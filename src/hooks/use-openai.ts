import { useMutation, useQueryClient } from "@tanstack/react-query";
import { generateAIResponse } from "@/lib/actions/openai";
import { Message } from "@/lib/types";

export function useGenerateAIResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatId, context, model }: { chatId: string, context: Message[], model: string }) => 
      generateAIResponse(chatId, context, model),
    onSuccess: (aiMessage, variables) => {
      queryClient.setQueryData(['messages', variables.chatId], (old: Message[] = []) => {
        return [...old, aiMessage];
      });
    }
  })
}

