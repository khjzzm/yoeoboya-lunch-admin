export type NoticeStatus = "ACTIVE" | "INACTIVE" | "DELETED";
export type NoticePriority = "LOW" | "MEDIUM" | "HIGH";

export interface NoticeRequest {
  title: string;
  content: string;
  category: string;
  author: string;
  priority: NoticePriority;
  startDate?: string | null;
  endDate?: string | null;
  attachmentUrl?: string | null;
  tags?: string | null;
  status: NoticeStatus;
}


export interface NoticeResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  priority: number; // 0 = 낮음, 1 = 보통, 2 = 높음
  startDate: string | null;
  endDate: string | null;
  attachmentUrl: string | null;
  viewCount: number;
  tags: string | null;
  status: NoticeStatus;
  isRead: boolean;
}



