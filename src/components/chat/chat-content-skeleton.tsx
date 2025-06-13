import { Loader2 } from "lucide-react";

export function ChatContentSkeleton() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <Loader2 className="animate-spin text-muted-foreground" />
    </div>
  );
} 