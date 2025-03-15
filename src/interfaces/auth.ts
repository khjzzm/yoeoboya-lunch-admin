// User 인터페이스 (회원 정보)
export interface User {
  loginId: string;
  email?: string;
  name?: string;
  provider?: string;
  role?: string;
  accessToken: string;
  refreshToken: string;
}

// Auth 상태관리 인터페이스
export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}
