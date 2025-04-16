// types/anonymousBoard.ts

export interface AnonymousBoardCreate {
  nickname: string;
  content: string;
  password: string;
  clientUUID?: string;
  deleteAt?: string; // ISO 문자열 또는 LocalDateTime 기준 (nullable)
}

export interface AnonymousBoardUpdate {
  boardId: number;
  content: string;
  password: string;
}

export interface AnonymousBoardDelete {
  boardId: number;
  password: string;
}

export interface AnonymousBoardReport {
  boardId: number;
  reason?: string; // optional한 사유
}

export interface AnonymousBoardResponse {
  boardId: number;
  title: string;
  content: string;
  likeCount: number;
  reportCount: number;
  createdDate: string;
  nickname: string;
  deleteAt?: string;
  clientUUID: string;
  remainingTime: string;
}
