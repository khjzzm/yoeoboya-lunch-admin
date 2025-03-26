// 댓글 + 대댓글 응답 타입
export interface Reply {
  replyId: number;
  parentId?: number; // 대댓글일 경우 부모 ID
  writer: string;
  content: string;
  date: string;
  childReplies: Reply[]; // 대댓글 목록
}