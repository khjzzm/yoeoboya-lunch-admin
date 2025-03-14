import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";
import {AuthState} from "@/interfaces/auth";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // or sessionStorage
    }
  )
);