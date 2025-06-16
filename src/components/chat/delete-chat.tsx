import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { deleteChat } from "@/lib/actions/chats";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Chat } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface DeleteChatProps {
  chatId: string;
  open: boolean;
  onOpenChange: (open: boolean, hover: boolean) => void;
}

export function DeleteChat({ chatId, open, onOpenChange }: DeleteChatProps) {

  const [isDeleting, setIsDeleting] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteChat(chatId);
      
      queryClient.setQueryData(['chats'], (old: Chat[]) => old.filter(chat => chat.id !== chatId));
      queryClient.removeQueries({ queryKey: ['messages', chatId] });
      
      toast.success("Chat deleted successfully");
      
      onOpenChange(false, false);
      
      
      if (pathname.includes(chatId)) {
        setTimeout(() => {
          router.replace('/');
        }, 100);
      }
    } catch (error) {
      toast.error("Failed to delete chat: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open, false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete chat</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this chat? All messages will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false, false)}>Cancel</Button>
          <Button disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>
            {isDeleting && <Loader2 className="animate-spin" />}
            {!isDeleting ? "Delete" : "Deleting..."}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}