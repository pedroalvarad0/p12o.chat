import { create } from "zustand";

interface StreamingState {
  isStreaming: boolean;
  isWaitingCompletion: boolean;
  setStreaming: (isStreaming: boolean) => void;
  setWaitingCompletion: (isWaitingCompletion: boolean) => void;
}

export const useStreamingStore = create<StreamingState>((set) => ({
  isStreaming: false,
  isWaitingCompletion: false,
  setStreaming: (isStreaming) => set({ isStreaming }),
  setWaitingCompletion: (isWaitingCompletion) => set({ isWaitingCompletion }),
})); 