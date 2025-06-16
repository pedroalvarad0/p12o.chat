import { create } from 'zustand'

interface ChatInputStore {
  input: string
  isSending: boolean
  
  setInput: (input: string) => void
  setIsSending: (sending: boolean) => void
  clearInput: () => void
  reset: () => void
}

const initialState = {
  input: '',
  isSending: false
}

export const useChatInputStore = create<ChatInputStore>((set) => ({
  // Estado inicial
  ...initialState,
  
  setInput: (input: string) => set({ input }),
  setIsSending: (isSending: boolean) => set({ isSending }),
  clearInput: () => set({ input: '' }),
  reset: () => set(initialState)
}))