import { Chat } from "@/lib/types";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useChatStore } from "@/lib/stores/chat-store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { Trash2, Edit2 } from "lucide-react";
import { useState } from "react";
import { RenameChat } from "../chat/rename-chat";
import { DeleteChat } from "../chat/delete-chat";

interface ChatSidebarItemProps {
  chat: Chat;
}

export function ChatSidebarItem({ chat }: ChatSidebarItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { selectedChatId, selectChat } = useChatStore();
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  
  const openRenameChat = (open: boolean, hover: boolean) => {
    setIsRenaming(open);
    setIsHovered(hover);
  };
  
  const openDeleteChat = (open: boolean, hover: boolean) => {
    setIsDeleting(open);
    setIsHovered(hover);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openRenameChat(true, true);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openDeleteChat(true, true);
  };

  return (
    <SidebarMenuItem className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>

      <SidebarMenuButton
        asChild
        className={cn(
          "transition-all duration-200",
          (chat.id === selectedChatId || isHovered) && "bg-accent text-accent-foreground",
          isHovered && "pr-20"
        )}
      >
        <Link href={`/chat/${chat.id}`} className="flex items-center space-x-2" onClick={() => selectChat(chat.id)}>
          <span className="truncate min-w-0">
            {chat.name}
          </span>
        </Link>
      </SidebarMenuButton>

      <div className={cn(
        "absolute right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1 transition-all duration-200 ease-in-out",
        isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
      )}>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 cursor-pointer hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 transition-colors"
          onClick={handleEdit}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 cursor-pointer hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          onClick={handleDelete}
        >
          <Trash2 className="h-3 w-3 text-red-500" />
        </Button>
      </div>

      <RenameChat chatId={chat.id} chatName={chat.name} open={isRenaming} onOpenChange={openRenameChat} />
      <DeleteChat chatId={chat.id} open={isDeleting} onOpenChange={openDeleteChat} />

    </SidebarMenuItem>
  )
}