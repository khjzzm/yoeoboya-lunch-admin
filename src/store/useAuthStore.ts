import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { AuthState } from "@/types";

const roleHierarchy: Record<string, string[]> = {
  ROLE_ADMIN: ["ROLE_MANAGER", "ROLE_USER", "ROLE_GUEST"],
  ROLE_MANAGER: ["ROLE_USER", "ROLE_GUEST"],
  ROLE_USER: ["ROLE_GUEST"],
  ROLE_GUEST: [],
  ROLE_BLOCK: [], // 별도 처리
};

const getRoleUtils = (get: () => AuthState) => ({
  hasRole: (role: string): boolean => {
    const currentRole = get().user?.role;
    if (!currentRole) return false;

    // 현재 role이 정확히 동일하거나, 상위 권한이면 true
    return currentRole === role || roleHierarchy[currentRole]?.includes(role);
  },

  isAdmin: () => get().user?.role === "ROLE_ADMIN",
  isManager: () => ["ROLE_ADMIN", "ROLE_MANAGER"].includes(get().user?.role ?? ""),
  isBlocked: () => get().user?.role === "ROLE_BLOCK",
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isExpired: false,

      setUser: (user) => set({ user }),
      setExpired: (val: boolean) => set({ isExpired: val }),

      logout: () =>
        set({
          user: null,
          isExpired: false,
        }),
      ...getRoleUtils(get),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // or sessionStorage
    },
  ),
);
