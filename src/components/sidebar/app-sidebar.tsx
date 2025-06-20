"use client"

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { ChevronUp, ChevronDown, CircleUser, LogOut, LogIn, Loader2, AlertCircle, SquarePlus, Key } from "lucide-react";
import { handleSignOut } from "@/lib/actions/auth";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "../ui/dropdown-menu";
import Link from "next/link";
import { AuthDialog } from "../auth/auth-dialog";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/stores/chat-store"; 
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { ChatSidebarItem } from "./chat-sidebar-item";
import { OpenRouterApiKeyDialog } from "../openrouter/openrouter-api-key-dialog";
import { useOpenRouterApiKey } from "@/hooks/use-openrouter-api-key";

export function AppSidebar() {
  const { data: user } = useUser();
  const { hasApiKey } = useOpenRouterApiKey();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [isOpenRouterApiKeyDialogOpen, setIsOpenRouterApiKeyDialogOpen] = useState(false);
  const { data: chats, isLoading: isLoadingChats, error: chatsError } = useChats({ 
    enabled: !!user 
  });
  const { selectedChatId } = useChatStore();

  async function onSignOut() {
    try {
      await handleSignOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-2xl font-bold mx-2 select-none">p12o.chat</h1>

        <SidebarMenu>
          {user ?(
            <>
            <SidebarMenuItem>
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <CircleUser />
                    <span className="truncate min-w-0">
                      {user.email}
                    </span>
                    {isDropdownOpen ? <ChevronUp className="ml-auto flex-shrink-0" /> : <ChevronDown className="ml-auto flex-shrink-0" />}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]">
                  {/* <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem> */}
                  <DropdownMenuItem onSelect={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsOpenRouterApiKeyDialogOpen(true)}>
                <Key />
                <span>OpenRouter API Key</span>
                {hasApiKey && (
                  <div className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
            </>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsAuthDialogOpen(true)}>
                <LogIn />
                <span>Sign In</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(selectedChatId === null && "bg-accent text-accent-foreground")}
            >
              <Link href="/">
                <SquarePlus />
                <span>New chat</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        
        <SidebarGroup>
          <SidebarGroupLabel>
            Chats
          </SidebarGroupLabel>

          <SidebarGroupContent>
            {!user ? (
              <div className="flex items-center justify-center px-2 text-muted-foreground">
                <span className="text-sm">Sign in to view your chats.</span>
              </div>
            ) : (
              <>
                {
                  isLoadingChats && (
                    <div className="flex items-center justify-center px-2 text-muted-foreground">
                      <Loader2 className="animate-spin mr-2" />
                      <span className="text-sm">Loading chats...</span>
                    </div>
                  )
                }
                {
                  chatsError && !isLoadingChats && (
                    <div className="flex items-center justify-center px-2 text-destructive">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      <span className="text-sm">Error loading chats.</span>
                    </div>
                  )
                }
                {
                  !isLoadingChats && !chatsError && chats && chats.length === 0 && (
                    <div className="flex items-center justify-center px-2 text-muted-foreground">
                      <span className="text-sm">No chats found.</span>
                    </div>
                  )
                }
                {
                  !isLoadingChats && !chatsError && chats && chats.length > 0 && (
                    <SidebarMenu>
                      {chats.map((chat) => (
                        <ChatSidebarItem key={chat.id} chat={chat} />
                      ))}
                    </SidebarMenu>
                  )
                }
              </>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      <OpenRouterApiKeyDialog open={isOpenRouterApiKeyDialogOpen} onOpenChange={setIsOpenRouterApiKeyDialogOpen} /> 
    </Sidebar>
  );
}