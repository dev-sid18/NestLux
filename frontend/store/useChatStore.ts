import { create } from 'zustand';

interface ChatState {
  context: string;
  setContext: (context: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  context: "Global Real Estate Platform Homepage",
  setContext: (context) => set({ context }),
}));
