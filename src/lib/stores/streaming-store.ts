import { create } from "zustand";

interface StreamingState {
  streamingChatId: string | null;
  setStreaming: (chatId: string | null) => void;
}

export const useStreamingStore = create<StreamingState>((set) => ({
  streamingChatId: null,
  setStreaming: (chatId) => set({ streamingChatId: chatId }),
})); 