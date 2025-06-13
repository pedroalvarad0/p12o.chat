import { create } from 'zustand'

interface ChatInputStore {
  // Estado
  model: string
  input: string
  isSending: boolean
  
  // Acciones
  setModel: (model: string) => void
  setInput: (input: string) => void
  setIsSending: (sending: boolean) => void
  clearInput: () => void
  reset: () => void
}

const initialState = {
  model: 'gpt-4o',
  input: '',
  isSending: false
}

export const useChatInputStore = create<ChatInputStore>((set) => ({
  // Estado inicial
  ...initialState,
  
  // Acciones
  setModel: (model: string) => set({ model }),
  setInput: (input: string) => set({ input }),
  setIsSending: (isSending: boolean) => set({ isSending }),
  clearInput: () => set({ input: '' }),
  reset: () => set(initialState)
}))