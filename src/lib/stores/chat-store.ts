import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChatStore {
  selectedChatId: string | null;
  selectChat: (chatId: string | null) => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      selectedChatId: null,
      selectChat: (chatId: string | null) => set({ selectedChatId: chatId }),
    }),
    { name: "chat-store" }
  )
);