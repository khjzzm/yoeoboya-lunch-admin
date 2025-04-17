import { create } from "zustand";

interface AnonymousStore {
  contentToWrite: string;
  setContentToWrite: (content: string) => void;
}

export const useAnonymousStore = create<AnonymousStore>((set) => ({
  contentToWrite: "",
  setContentToWrite: (content) => set({ contentToWrite: content }),
}));
