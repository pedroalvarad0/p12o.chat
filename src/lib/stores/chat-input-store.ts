import { create } from 'zustand'

interface ChatInputStore {
  // Estado
  model: string
  input: string
  
  // Acciones
  setModel: (model: string) => void
  setInput: (input: string) => void
  clearInput: () => void
  reset: () => void
}

const initialState = {
  model: 'gpt-4o',
  input: ''
}

export const useChatInputStore = create<ChatInputStore>((set) => ({
  // Estado inicial
  ...initialState,
  
  // Acciones
  setModel: (model: string) => set({ model }),
  setInput: (input: string) => set({ input }),
  clearInput: () => set({ input: '' }),
  reset: () => set(initialState)
}))