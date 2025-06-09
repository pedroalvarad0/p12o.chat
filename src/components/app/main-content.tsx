'use client'

import { useChatStore } from "@/lib/stores/chat-store";
import { useEffect } from "react";

export function MainContent() {
  const { selectChat } = useChatStore();
  
  useEffect(() => {
    selectChat(null);
  }, [selectChat]);

  return (
    <>
    </>
  )
}