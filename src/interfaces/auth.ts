// User 인터페이스 (회원 정보)
export interface User {
  loginId: string;
  email?: string;
  name?: string;
  provider?: string;
  role?: string;
}

// Auth 상태관리 인터페이스
export interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}


// 비밀번호 변경
export interface ChangePasswordData {
  loginId: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// 회원가입
export interface SignUpData {
  loginId: string;
  email: string;
  name: string;
  password: string;
}