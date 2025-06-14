import { create } from "zustand";

interface StreamingState {
  isStreaming: boolean;
  setStreaming: (isStreaming: boolean) => void;
}

export const useStreamingStore = create<StreamingState>((set) => ({
  isStreaming: false,
  setStreaming: (isStreaming) => set({ isStreaming }),
})); 