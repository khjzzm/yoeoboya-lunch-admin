export interface FreeBoardCreate {
  title: string; // 제목 (필수)
  content: string; // 내용 (필수)
  hashTag?: string[]; // 해시태그 (옵션)
  pin: number; // 비밀번호 (정수, 최대 4자리)
  secret: boolean; // 비밀글 여부
}

export interface BoardEdit {
  title?: string; // 제목 (옵션)
  content?: string; // 내용 (옵션)
  hashTag?: string[]; // 해시태그 (옵션)
  pin?: number; // 비밀번호 (옵션)
  secret?: boolean; // 비밀글 여부 (옵션)
}

export interface FreeBoardResponse {
  boardId: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  secret: boolean;
  loginId: string;
  name: string;
  viewCount: number;
  replyCount: number;
  likeCount: number;
  like: boolean;
  createdDate: string | null;
}

export interface FreeBoardDetailResponse {
  boardId: number;
  title: string;
  content: string;
  category: string;
  pinned: number;
  secret: boolean;
  viewCount: number;
  hashTag: HashTagResponse[];
  hasLiked: boolean;
  createdDate: string | null;
}

export interface HashTagResponse {
  tag: string;
}
