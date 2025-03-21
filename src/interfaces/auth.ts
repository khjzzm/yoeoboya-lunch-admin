// User 인터페이스 (회원 정보)
export interface User {
  loginId: string;
  email?: string;
  name?: string;
  provider?: string;
  role?: string;
  account?: Account;
  info?: UserInfo;
  profileImages?: ProfileImage[];
}

// 계좌 정보 인터페이스
export interface Account {
  bankName: string;
  accountNumber: string;
}

// 사용자 정보 (닉네임, 소개, 전화번호)
export interface UserInfo {
  nickName: string;
  bio: string;
  phoneNumber: string;
}

// 프로필 이미지 정보
export interface ProfileImage {
  profileImageNo: number;
  fileName: string;
  imageUrl: string;
  thumbnailUrl: string;
  isDefault: boolean;
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

// URL 파라미터 파싱용 타입은 모두 optional
export interface SocialSignUpQueryParams {
  loginId?: string;
  email?: string;
  name?: string;
  provider?: string;
  profileImageUrl?: string;
}