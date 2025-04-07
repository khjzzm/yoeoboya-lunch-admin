import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import stringify from "fast-json-stable-stringify";
import { useRouter } from "next/navigation";

import {
  ApiResponse,
  BoardSearchCondition,
  NoticeDetailResponse,
  NoticeCreate,
  NoticeResponse,
  Pagination,
  NoticeEdit,
} from "@/types";

import {
  useCreateReply,
  useDeleteReply,
  useReplies,
  useLike,
  useUnlike,
  useUploadFileToS3,
} from "@/lib/queries";
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
        if (filters.boardNo !== undefined) {
          params.set("boardNo", String(filters.boardNo));
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
    mutationFn: async (noticeData: NoticeCreate) => {
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
export function useNoticeDetail(boardNo: number | null) {
  return useQuery<ApiResponse<NoticeDetailResponse>>({
    queryKey: ["noticeDetail", boardNo],
    queryFn: async () => {
      const { data } = await api.get(`/support/notice/detail`, {
        params: { boardNo },
      });
      return data;
    },
    enabled: !!boardNo && boardNo > 0,
  });
}

/** 공지사항 수정 Hook */
export function useUpdateNotice(boardNo: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updatedNotice: NoticeEdit) => {
      const { data } = await api.put(`/support/notice`, updatedNotice, {
        params: { boardNo },
      });
      return data;
    },
    onSuccess: () => {
      message.success("공지사항이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["notices"] });
      queryClient.invalidateQueries({ queryKey: ["noticeDetail", boardNo] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 공지사항 삭제 Hook */
export function useDeleteNotice(boardNo: number) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/support/notice`, {
        params: { boardNo },
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
export const useNoticeDeleteReply = (boardNo: number) =>
  useDeleteReply("/support/notice", "notice", boardNo);
export const useNoticeReplies = (boardNo: number) =>
  useReplies("/support/notice", "notice", boardNo);
export const useLikeNotice = (boardNo: number) => useLike("/support/notice", "notice", boardNo);
export const useUnlikeNotice = (boardNo: number) => useUnlike("/support/notice", "notice", boardNo);
export const useUploadNoticeFileToS3 = () => useUploadFileToS3("/support/notice/image");
