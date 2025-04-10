import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import stringify from "fast-json-stable-stringify";
import { useRouter } from "next/navigation";

import {
  ApiResponse,
  BoardEdit,
  BoardSearchCondition,
  FreeBoardCreate,
  FreeBoardDetailResponse,
  FreeBoardResponse,
  Pagination,
} from "@/types";

import {
  useCreateReply,
  useDeleteReply,
  useHashtagSearch,
  useLike,
  usePopularHashtags,
  useReplies,
  useUnlike,
  useUploadFileToS3,
} from "@/lib/queries";
import { useVerifyPassword } from "@/lib/queries/board/base/useSecret";
import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

// 게시글 목록 조회 (검색, 페이지네이션 포함)
export function useFreeBoards(page: number, size: number, filters?: BoardSearchCondition) {
  return useQuery<{ list: FreeBoardResponse[]; pagination: Pagination }>({
    queryKey: ["freeBoards", page, size, stringify(filters)],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("size", String(size));

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

      const { data } = await api.get<
        ApiResponse<{ list: FreeBoardResponse[]; pagination: Pagination }>
      >(`/board/free?${params.toString()}`);
      return data?.data ?? [];
    },
  });
}

// 게시글 작성
export function useCreateFreeBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FreeBoardCreate) => {
      const { data } = await api.post(`/board/free`, payload);
      return data;
    },
    onSuccess: () => {
      message.success("게시글이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["freeBoards"] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 게시글 상세 조회
export function useFreeBoardDetail(boardNo: number | null, pin?: string) {
  return useQuery<FreeBoardDetailResponse>({
    queryKey: ["freeBoardDetail", boardNo, pin],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<FreeBoardDetailResponse>>(`/board/free/detail`, {
        params: {
          boardNo,
          ...(pin && { pin }),
        },
      });
      return data.data;
    },
    enabled: !!boardNo && boardNo > 0,
  });
}

// 게시글 수정
export function useUpdateFreeBoard(boardNo: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BoardEdit) => {
      const { data } = await api.put(`/board/free`, payload, {
        params: { boardNo },
      });
      return data;
    },
    onSuccess: () => {
      message.success("게시글이 수정되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["freeBoards"] });
      queryClient.invalidateQueries({ queryKey: ["freeBoardDetail", boardNo] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 게시글 삭제
export function useDeleteFreeBoard(boardNo: number) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`/board/free`, {
        params: { boardNo },
      });
      return data;
    },
    onSuccess: () => {
      message.success("게시글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["freeBoards"] });
      router.push("/board/free");
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export const useFreeBoardCreateReply = () => useCreateReply("/board/free", "freeBoard");
export const useFreeBoardDeleteReply = (boardNo: number) =>
  useDeleteReply("/board/free", "freeBoard", boardNo);
export const useFreeBoardReplies = (boardNo: number) => {
  return useReplies("/board/free", "freeBoard", boardNo);
};
export const useLikeFreeBoard = (boardNo: number) => useLike("/board/free", "freeBoard", boardNo);
export const useUnlikeFreeBoard = (boardNo: number) =>
  useUnlike("/board/free", "freeBoard", boardNo);
export const useUploadFreeBoardFileToS3 = () => useUploadFileToS3("/board/free/image");
export const useFreeBoardHashTagSearch = (keyword: string) =>
  useHashtagSearch("/board/free", keyword);
export const useFreeBoardPopularHashtags = () => usePopularHashtags("/board/free");
export const useFreeBoardVerifyPassword = () => useVerifyPassword("/board/free");
