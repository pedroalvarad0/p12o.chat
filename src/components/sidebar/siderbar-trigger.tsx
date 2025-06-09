"use client"

import { useIsMobile } from "@/hooks/use-mobile";
import { SidebarTrigger as UISidebarTrigger } from "@/components/ui/sidebar";

export function SidebarTrigger() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <UISidebarTrigger className="m-2 p-2" />
      </div>
    )
  }
  return (
    <UISidebarTrigger className="fixed top-0 m-2 p-2 z-50 bg-background" />
  )
}