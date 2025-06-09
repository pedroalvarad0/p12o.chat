"use client"

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarGroup, SidebarGroupLabel, SidebarGroupContent } from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { ChevronUp, ChevronDown, CircleUser, LogOut, User, LogIn } from "lucide-react";
import { handleSignOut } from "@/lib/actions/auth";
import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import Link from "next/link";
import { AuthDialog } from "./auth/auth-dialog";

interface SidebarProps {
  user: {
    email?: string;
    id: string;
  } | null
}

export function AppSidebar({ user }: SidebarProps) {
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  async function onSignOut() {
    setIsSigningOut(true);
    try {
      await handleSignOut();
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <h1 className="text-2xl font-bold">p12o.chat</h1>

        <SidebarMenu>
          {user ?(
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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsAuthDialogOpen(true)}>
                <LogIn />
                <span>Sign In</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Chats
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="" className="flex items-center space-x-2">
                    <span className="truncate min-w-0">
                      Chat 1
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* <SidebarFooter>
        <SidebarMenu>
          {user ?(
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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ) : (
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsAuthDialogOpen(true)}>
                <LogIn />
                <span>Sign In</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}

        </SidebarMenu>
      </SidebarFooter> */}

      <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
    </Sidebar>
  );
}