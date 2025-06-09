"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";

const MAX_CHARS = 1000;

export function ChatInput() {

  const [message, setMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    if (value.length <= MAX_CHARS) {
      setMessage(value);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Aquí puedes agregar la lógica para enviar el mensaje
      console.log("Enviando mensaje:", message);
      setMessage(""); // Limpiar el textarea después de enviar
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim()) {
        handleSubmit(e as any);
      }
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative flex flex-col rounded-t-lg border bg-background shadow-sm">
        <div className="relative">
          <Textarea
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything."
            className="min-h-[80px] resize-none rounded-b-none rounded-t-lg border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            maxLength={MAX_CHARS}
          />
          <span className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-background/80 px-1 rounded">
            {message.length} / {MAX_CHARS} characters
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 p-2 border-t bg-muted/50">
          <Select>
            <SelectTrigger className="w-[200px] border-0 bg-transparent focus:ring-0">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
            </SelectContent>
          </Select>

          <Button type="submit" variant="default" className="w-[40px] h-[40px]" disabled={!message.trim()}>
            <ArrowUp className="size-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}