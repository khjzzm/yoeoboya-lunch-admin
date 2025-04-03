export type NoticeStatus = "ACTIVE" | "INACTIVE";
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
  status: NoticeStatus;
}

import type {Dayjs} from "dayjs";
export interface NoticeFormValues {
  title: string;
  content: string;
  category: string;
  author: string;
  priority: NoticePriority;
  startDate?: Dayjs | null;
  endDate?: Dayjs | null;
  attachmentUrl?: string | null;
  status: NoticeStatus;
}

export interface NoticeDetailResponse {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  pinned: boolean;
  startDate: string | null;
  endDate: string | null;
  createDate : string | null;
  attachmentUrl: string | null;
  viewCount: number;
  status: NoticeStatus;
  isRead: boolean;
  likeCount: number;
  replyCount: number;
  hasLiked: boolean;
  hasFile: boolean;
}

