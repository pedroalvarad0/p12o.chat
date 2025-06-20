"use client"

import { Textarea } from "@/components/ui/textarea";
import { useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowUp, Loader2, CircleStop } from "lucide-react";
import { useChatInputStore } from "@/lib/stores/chat-input-store";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import { useMessageMutations } from "@/hooks/use-messages";
import { usePathname } from "next/navigation";
import { useChatStore } from "@/lib/stores/chat-store";
import { useStreamingStore } from "@/lib/stores/streaming-store";
import { SelectModel } from "../models/select-model";
import { useOptimisticChatCreation } from "@/hooks/use-optimistic-chat-creation";

const MAX_CHARS = 4000;
const MIN_HEIGHT = 100;
const MAX_HEIGHT = 180;

export function ChatInput() {

  const user = useUser();
  const { selectedChatId } = useChatStore();

  const { input, isSending, setInput, setIsSending } = useChatInputStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { createMessageOptimistic } = useMessageMutations();
  const { isStreaming, setStreaming } = useStreamingStore();
  const optimisticChatCreation = useOptimisticChatCreation();

  const pathname = usePathname();
  const isHome = pathname === "/";

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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim()) {
      setIsSending(true);

      if (!user.data) {
        toast.warning("You must be logged in to create a chat");
        setIsSending(false);
        return;
      }

      try {
        if (isHome) {
          await optimisticChatCreation.mutateAsync({
            content: input.trim()
          })
        } else {
          await createMessageOptimistic({
            chatId: selectedChatId!,
            content: input.trim(),
            role: "user",
            status: "complete"
          });
        }

        setInput("");
  
      } catch (error) {
        if (!isHome) {
          toast.error("Error sending message: " + (error instanceof Error ? error.message : String(error)));
        }
      } finally {
        
        setIsSending(false);
      }
    }
  }

  const handleStopStreaming = () => {
    setStreaming(false);
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSubmit();
    }
  }

  return (
    <div className="sticky bottom-0 w-full min-w-0">
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 md:px-8 min-w-0">
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
            <SelectModel />

            {
              (!isStreaming) && (
                <Button
                  type="submit"
                  variant="default"
                  className="w-[40px] h-[40px]"
                  disabled={!input.trim() || isSending}
                >
                  {
                    isSending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ArrowUp className="size-4" />
                    )
                  }
                </Button>
              )
            }

            {
              (isStreaming) && (
                <Button
                  type="button"
                  variant="default"
                  className="w-[40px] h-[40px]"
                  onClick={handleStopStreaming}
                >
                  <CircleStop className="size-4" />
                </Button>
              )
            }

          </div>
        </form>
      </div>
    </div>
  )
}