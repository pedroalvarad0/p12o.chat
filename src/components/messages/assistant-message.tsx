import { Message } from "@/lib/types";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

interface AssistantMessageProps {
  message: Message;
  isStreaming?: boolean;
  isWaitingCompletion?: boolean;
  isThinking?: boolean;
  isLastMessage?: boolean;
}

export function AssistantMessage({ 
  message, 
  isStreaming = false, 
  isWaitingCompletion = false, 
  isThinking = false,
  isLastMessage = false 
}: AssistantMessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex justify-start mb-4">
      <div className={`
        p-0 rounded-lg relative group bg-background w-full min-w-0
        ${isStreaming ? 'animate-pulse' : ''}
      `}>
        {/* Waiting completion indicator */}
        {isWaitingCompletion && isLastMessage && !isThinking && (
          <div className="flex items-center justify-between mt-2">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_1s_infinite_0ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_1s_infinite_200ms]" />
              <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-[bounce_1s_infinite_400ms]" />
            </div>
          </div>
        )}

        {
          isThinking && isLastMessage && (
            <div className="flex items-center justify-between mt-2">
              <div className="flex space-x-1">
                <span className="text-muted-foreground text-base">Thinking...</span>
              </div>
            </div>
          )
        }

        {/* Message content */}
        <div className="prose prose-sm max-w-none dark:prose-invert min-w-0 w-full">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              // Personalizar el renderizado de elementos específicos
              p: ({ children }) => (
                <p className="text-base mb-4 last:mb-0 leading-7 break-words">{children}</p>
              ),
              pre: ({ children }) => (
                <div className="w-full min-w-0 my-4">
                  <pre className="bg-muted rounded-lg overflow-x-auto text-xs leading-7 w-full">{children}</pre>
                </div>
              ),
              code: ({ children, className, ...props }) => {
                const isInline = !className?.includes('language-');
                return isInline ? (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm break-words" {...props}>
                    {children}
                  </code>
                ) : (
                  <code className={`${className} text-sm`} {...props}>{children}</code>
                );
              },
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-muted-foreground pl-4 italic my-4 max-w-full">
                  {children}
                </blockquote>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-outside ml-6 space-y-1 my-4 marker:text-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-outside ml-6 space-y-1 my-4 marker:text-foreground">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="pl-1 leading-7 break-words">{children}</li>
              ),
              table: ({ children }) => (
                <div className="w-full min-w-0 my-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border">
                      {children}
                    </table>
                  </div>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-border px-4 py-2 break-words">{children}</td>
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Message actions */}
        <div className="flex items-center justify-between mt-2">
          {/* Copy button */}
          {message.content && (
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
      </div>
    </div>
  );
} 