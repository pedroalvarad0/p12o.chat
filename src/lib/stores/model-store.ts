import { create } from "zustand";

interface ModelStore {
  model: string
  setModel: (model: string) => void
}

const initialState = {
  model: 'gpt-4o',
}

export const useModelStore = create<ModelStore>((set) => ({
  ...initialState,
  setModel: (model: string) => set({ model }),
}))