// 비밀번호 변경
export interface ChangePasswordRequest {
  loginId: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// 회원가입
export interface SignUpRequest {
  loginId: string;
  email: string;
  name: string;
  password: string;
  nickName?: string;
}

// 회원탈퇴
export interface WithdrawRequest {
  loginId: string;
  email: string;
  provider?: string;
  reason?: string;
  nickName?: string;
}

// 비밀번호 찾기 요청
export interface ResetPasswordRequest {
  loginId: string;
  email: string;
  authorityPage: string;
}

// URL 파라미터 파싱용 타입은 모두 optional
export type SocialProvider = "google" | "kakao" | "naver" | "github" | "microsoft" | "facebook";
export interface SocialSignUpRequest {
  loginId?: string;
  email?: string;
  name?: string;
  provider?: string | SocialProvider;
  profileImageUrl?: string;
  nickName?: string;
}
