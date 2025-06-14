import { Message } from "@/lib/types";

interface UserMessageProps {
  message: Message;
  isStreaming?: boolean;
}

export function UserMessage({ message, isStreaming = false }: UserMessageProps) {
  return (
    <div className="flex justify-start mb-4">
      <div className={`
        max-w-[80%] p-3 rounded-lg relative group bg-muted
        ${isStreaming ? 'animate-pulse' : ''}
      `}>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap text-base leading-relaxed mb-0">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
} 