import { Message } from "@/lib/types";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  isWaitingCompletion?: boolean;
  isLastMessage?: boolean;
}

export function ChatMessage({ message, isStreaming = false, isWaitingCompletion = false, isLastMessage = false }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUser = message.role === 'user';

  return (
    <div className={`flex justify-start mb-4`}>
      <div className={`
        ${isUser ? 'max-w-[80%]' : ''} ${isUser ? 'p-3' : 'p-0'} rounded-lg relative group
        ${isUser
          ? 'bg-muted'
          : 'bg-background'
        }
        ${isStreaming ? 'animate-pulse' : ''}
      `}>

        {isWaitingCompletion && isLastMessage && !isUser && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_1s_infinite_0ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_1s_infinite_200ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_1s_infinite_400ms]" />
            </div>
          </div>
        )}

        {/* Message content */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-base leading-relaxed mb-0">
            {message.content}
          </p>
        </div>

        {/* Message actions and timestamp */}
        {
          !isUser && (
            <div className="flex items-center justify-between mt-2">

              {/* Copy button - only show for assistant messages */}
              {!isUser && message.content && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                >
                  {copied ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          )
        }


      </div>
    </div>
  );
} 