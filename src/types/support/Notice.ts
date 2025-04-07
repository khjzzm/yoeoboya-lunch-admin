export type NoticeStatus = "ACTIVE" | "INACTIVE";
export type NoticePriority = "LOW" | "MEDIUM" | "HIGH";

import type { Dayjs } from "dayjs";
export interface NoticeFormValues {
  title: string;
  content: string;
  categoryId: string;
  author: string;
  priority: NoticePriority;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  attachmentUrl?: string | null;
  status: NoticeStatus;
}

export interface NoticeCreate {
  title: string;
  content: string;
  categoryId: string;
  author: string;
  priority: NoticePriority;
  startDate?: string | null;
  endDate?: string | null;
  attachmentUrl?: string | null;
  status: NoticeStatus;
}

export interface NoticeEdit {
  title: string;
  content: string;
  categoryId: string;
  author: string;
  priority: NoticePriority;
  startDate?: string | null;
  endDate?: string | null;
  attachmentUrl?: string | null;
  status: NoticeStatus;
}

export interface NoticeResponse {
  boardNo: number;
  title: string;
  content: string;
  summary: string;
  category: string;
  author: string;
  pinned: boolean;
  startDate: string;
  endDate: string;
  viewCount: number;
  status: NoticeStatus;
  likeCount: number;
  replyCount: number;
  hasFile: boolean;
  createDate: string; // from LocalDateTime
}

export interface NoticeDetailResponse {
  boardNo: number;
  title: string;
  content: string;
  category: string;
  viewCount: number;
  hasLiked: boolean;
  pinned: boolean;
  author: string;
  startDate: string; // ISO format (from LocalDate)
  endDate: string;
  status: NoticeStatus;
}
