import { Member } from "@/types";

export interface AuthState {
  user: Member | null;
  setUser: (user: Member | null) => void;
  isExpired: boolean;
  setExpired: (val: boolean) => void;
  logout: () => void;

  // 역할 관련 유틸
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isBlocked: () => boolean;
}
