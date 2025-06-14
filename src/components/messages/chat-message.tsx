import { Message } from "@/lib/types";
import { UserMessage } from "./user-message";
import { AssistantMessage } from "./assistant-message";

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  isWaitingCompletion?: boolean;
  isLastMessage?: boolean;
}

export function ChatMessage({ 
  message, 
  isStreaming = false, 
  isWaitingCompletion = false, 
  isLastMessage = false 
}: ChatMessageProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <UserMessage 
        message={message} 
        isStreaming={isStreaming} 
      />
    );
  }

  return (
    <AssistantMessage 
      message={message} 
      isStreaming={isStreaming} 
      isWaitingCompletion={isWaitingCompletion} 
      isLastMessage={isLastMessage} 
    />
  );
} 