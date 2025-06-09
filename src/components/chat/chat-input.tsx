"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useEffect } from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { useChatInputStore } from "@/lib/stores/chat-input-store";
import { createChat } from "@/lib/actions/chats";

const MAX_CHARS = 1000;
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 180;

export function ChatInput() {
  const { model, input, setModel, setInput } = useChatInputStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (input.trim()) {

      const chat = await createChat();

      // Aquí puedes agregar la lógica para enviar el mensaje
      console.log("Enviando mensaje:", input);
      setInput("");
    }
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
    <div className="w-full">
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

          <Button type="submit" variant="default" className="w-[40px] h-[40px]" disabled={!input.trim()}>
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}