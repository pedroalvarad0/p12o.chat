import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { renameChat } from "@/lib/actions/chats";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Chat } from "@/lib/types";
import { Loader2 } from "lucide-react";

interface RenameChatProps {
  chatId: string;
  chatName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RenameChat({ chatId, chatName, open, onOpenChange }: RenameChatProps) {
  const [name, setName] = useState(chatName);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await renameChat(chatId, name);

      //queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.setQueryData(['chats'], (old: Chat[]) => old.map(chat => chat.id === chatId ? { ...chat, name } : chat));

      toast.success("Chat renamed successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to rename chat");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            Enter a new name for your chat.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!name.trim() || isSaving}>
              {isSaving && <Loader2 className="animate-spin" />}
              {!isSaving ? "Save" : "Saving..."}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}