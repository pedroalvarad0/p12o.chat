import { Chat } from "@/lib/types";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useChatStore } from "@/lib/stores/chat-store";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ChatSidebarItemProps {
    chat: Chat;
}

export function ChatSidebarItem({ chat }: ChatSidebarItemProps) {

    const { selectedChatId, selectChat } = useChatStore();

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                className={cn(
                    chat.id === selectedChatId && "bg-accent text-accent-foreground"
                )}
            >
                <Link href={`/chat/${chat.id}`} className="flex items-center space-x-2" onClick={() => selectChat(chat.id)}>
                    <span className="truncate min-w-0">
                        {chat.name}
                    </span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}