// 댓글 + 대댓글 응답 타입
export interface Reply {
  replyId: number;
  parentId?: number; // 대댓글일 경우 부모 ID
  writer: string;
  content: string;
  date: string;
  mine: boolean;
  deleted: boolean;
  childReplies: Reply[]; // 대댓글 목록
}

export interface ReplyCreateRequest {
  boardId: number;
  loginId?: string;
  content: string;
  parentReplyId?: number | null;
}
