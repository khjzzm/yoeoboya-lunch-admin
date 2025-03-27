import {User} from "@/types";

export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
}
