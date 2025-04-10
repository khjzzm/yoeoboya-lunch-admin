// Member 인터페이스 (회원 정보)
export interface Member {
  loginId: string;
  email?: string;
  name?: string;
  provider?: string;
  role: string;
  roleDesc?: string;
  account?: Account;
  info?: MemberInfo;
  profileImages?: ProfileImage[];
}

// 계좌 정보 인터페이스
export interface Account {
  bankName: string;
  accountNumber: string;
}

// 사용자 정보 (닉네임, 소개, 전화번호)
export interface MemberInfo {
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
