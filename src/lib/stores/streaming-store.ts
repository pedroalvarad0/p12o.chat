import { create } from "zustand";

interface StreamingState {
  isStreaming: boolean;
  isWaitingCompletion: boolean;
  isThinking: boolean;
  setStreaming: (isStreaming: boolean) => void;
  setWaitingCompletion: (isWaitingCompletion: boolean) => void;
  setThinking: (isThinking: boolean) => void;
}

export const useStreamingStore = create<StreamingState>((set) => ({
  isStreaming: false,
  isWaitingCompletion: false,
  isThinking: false,
  setStreaming: (isStreaming) => set({ isStreaming }),
  setWaitingCompletion: (isWaitingCompletion) => set({ isWaitingCompletion }),
  setThinking: (isThinking) => set({ isThinking }),
})); 