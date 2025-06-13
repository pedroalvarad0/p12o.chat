"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowUp, Loader2 } from "lucide-react";
import { useChatInputStore } from "@/lib/stores/chat-input-store";
import { createMessage } from "@/lib/actions/messages";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useCreateChat } from "@/hooks/use-chats";
import { useRouter } from "next/navigation";
import { useGenerateAIResponse } from "@/hooks/use-openai";
import { generateAIResponse } from "@/lib/actions/openai";
import { useCreateMessage } from "@/hooks/use-messages";
import { useQueryClient } from "@tanstack/react-query";
import { Message } from "@/lib/types";
import { useStreamingAIResponse } from "@/hooks/use-openai-stream";
import { usePathname } from "next/navigation";

const MAX_CHARS = 1000;
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 180;

interface ChatInputProps {
  location: string;
}

export function ChatInput({ location }: ChatInputProps) {
  const { data: user } = useUser();
  const { model, input, setModel, setInput } = useChatInputStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { mutateAsync: createChatMutation } = useCreateChat();
  const { mutateAsync: createMessageMutation } = useCreateMessage();
  const { mutateAsync: generateAIResponseMutation } = useGenerateAIResponse();
  const { generateStreamingResponse, isStreaming } = useStreamingAIResponse();
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const pathname = usePathname();
  const isHome = pathname === "/";

  console.log("isHome = ", isHome);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = `${MIN_HEIGHT}px`;

      const scrollHeight = textarea.scrollHeight;

      const newHeight = Math.min(Math.max(scrollHeight, MIN_HEIGHT), MAX_HEIGHT);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [input]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= MAX_CHARS) {
      setInput(value);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    if (input.trim()) {
      if (!user) {
        toast.warning("You must be logged in to create a chat");
        setIsSending(false);
        return;
      }

      try {
        // Create a new chat and get the result
        if (location === "home") {
          const newChat = await createChatMutation();
          const newMessage = await createMessage(newChat.id, input.trim(), "user");
          router.push(`/chat/${newChat.id}`);

          setInput("");

          const context = [newMessage];

          await generateStreamingResponse({
            chatId: newChat.id,
            context,
            model
          });
        } else {

          await createMessageMutation({
            chatId: location,
            content: input.trim(),
            role: "user"
          });

          setInput("");

          const context = queryClient.getQueryData<Message[]>(['messages', location]) || [];

          // Use streaming instead of regular response
          await generateStreamingResponse({
            chatId: location,
            context,
            model
          });

        }


      } catch (error) {
        console.error("Error creating chat or message:", error);
        toast.error("Failed to send message");
      }
    }
    setIsSending(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        handleSubmit(e as any);
      }
    }
  }

  return (
    <div className="sticky bottom-0 w-full">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 md:px-8">
        <form onSubmit={handleSubmit} className="relative flex flex-col rounded-t-lg border bg-background shadow-sm">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything."
              className="resize-none rounded-b-none rounded-t-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 overflow-y-auto"
              maxLength={MAX_CHARS}
              style={{ height: `${MIN_HEIGHT}px` }}
            />
            <span className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-1 rounded">
              {input.length} / {MAX_CHARS} characters
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 p-2 border-t bg-muted/50">
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger className="w-[200px] border-0 bg-transparent focus:ring-0">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
              </SelectContent>
            </Select>

            <Button type="submit" variant="default" className="w-[40px] h-[40px]" disabled={!input.trim() || isSending || isStreaming}>
              {(isSending || isStreaming) ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowUp className="size-4" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}