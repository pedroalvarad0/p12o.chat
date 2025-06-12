import { create } from "zustand";

interface StreamingState {
  isStreaming: boolean;
  streamingChatId: string | null;
  setStreaming: (chatId: string | null) => void;
  clearStreaming: () => void;
}

export const useStreamingStore = create<StreamingState>((set) => ({
  isStreaming: false,
  streamingChatId: null,
  setStreaming: (chatId) => set({ isStreaming: true, streamingChatId: chatId }),
  clearStreaming: () => set({ isStreaming: false, streamingChatId: null }),
})); 