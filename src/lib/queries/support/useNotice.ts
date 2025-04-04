import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import stringify from "fast-json-stable-stringify";
import { useRouter } from "next/navigation";

import {
  ApiResponse,
  BoardSearchCondition,
  NoticeDetailResponse,
  NoticeRequest,
  NoticeResponse,
  Pagination,
} from "@/types";

import {
  useCreateReply,
  useDeleteReply,
  useReplies,
  useLike,
  useUnlike,
  useUploadFileToS3,
} from "@/lib/queries/useBoardHooks";
import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

/** 공지사항 목록 조회 (검색 시 호출용) */
export function useNotices(page: number, pageSize: number, filters?: BoardSearchCondition) {
  return useQuery<ApiResponse<{ list: NoticeResponse[]; pagination: Pagination }>>({
    queryKey: ["fetchNotices", page, pageSize, stringify(filters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(pageSize));

      if (filters) {
        if (filters.searchType) {
          params.set("searchType", filters.searchType);
        }
        if (filters.keyword) {
          params.set("keyword", filters.keyword);
        }
        if (filters.boardId !== undefined) {
          params.set("boardId", String(filters.boardId));
        }
      }

      const { data } = await api.get(`/support/notice?${params.toString()}`);
      return data;
    },
  });
}

/** 공지사항 등록 */
export function useCreateNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noticeData: NoticeRequest) => {
      const { data } = await api.post(`/support/notice`, noticeData);
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 상세 조회 */
export function useNoticeDetail(noticeId: number | null) {
  return useQuery<ApiResponse<NoticeDetailResponse>>({
    queryKey: ["noticeDetail", noticeId],
    queryFn: async () => {
      const { data } = await api.get(`/support/notice/detail`, {
        params: { noticeId },
      });
      return data;
    },
    enabled: !!noticeId && noticeId > 0,
  });
}

/** 공지사항 수정 Hook */
export function useUpdateNotice(noticeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedNotice: NoticeRequest) => {
      const { data } = await api.put(`/support/notice`, updatedNotice, {
        params: { noticeId },
      });
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["noticeDetail", noticeId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 삭제 Hook */
export function useDeleteNotice(noticeId: number) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/support/notice`, {
        params: { noticeId },
      });
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      router.push("/support/notice");
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export const useNoticeCreateReply = () => useCreateReply("/support/notice", "notice");
export const useNoticeDeleteReply = (noticeId: number) =>
  useDeleteReply("/support/notice", "notice", noticeId);
export const useNoticeReplies = (noticeId: number) =>
  useReplies("/support/notice", "notice", noticeId);
export const useLikeNotice = (noticeId: number) => useLike("/support/notice", "notice", noticeId);
export const useUnlikeNotice = (noticeId: number) =>
  useUnlike("/support/notice", "notice", noticeId);
export const useUploadNoticeFileToS3 = () => useUploadFileToS3("/support/notice/image");
