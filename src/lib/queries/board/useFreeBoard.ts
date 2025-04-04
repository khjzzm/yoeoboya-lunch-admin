import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {api} from "@/lib/utils/api";
import {message} from "antd";
import {apiErrorMessage} from "@/lib/utils/apiErrorMessage";
import stringify from "fast-json-stable-stringify";
import {
  ApiResponse,
  BoardEdit,
  FreeBoardCreate,
  NoticeDetailResponse,
  BoardSearchCondition,
  Pagination,
  FreeBoardResponse
} from "@/types";
import {
  useCreateReply,
  useDeleteReply,
  useReplies,
  useLike,
  useUnlike, useUploadFileToS3,
} from "@/lib/queries/useBoardHooks";

/** 게시글 목록 조회 (검색, 페이지네이션 포함) */
export function useFreeBoards(
  page: number,
  size: number,
  filters?: BoardSearchCondition
) {
  return useQuery<ApiResponse<{ list: FreeBoardResponse[]; pagination: Pagination }>>({
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
        if (filters.boardId !== undefined) {
          params.set("boardId", String(filters.boardId));
        }
      }

      const {data} = await api.get(`/board/free?${params.toString()}`);
      return data;
    },
  });
}

/** 게시글 작성 */
export function useCreateFreeBoard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FreeBoardCreate) => {
      const {data} = await api.post(`/board/free`, payload);
      return data;
    },
    onSuccess: () => {
      message.success("게시글이 등록되었습니다.");
      queryClient.invalidateQueries({queryKey: ["freeBoards"]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

/** 게시글 상세 조회 */
export function useFreeBoardDetail(boardId: number | null) {
  return useQuery({
    queryKey: ["freeBoardDetail", boardId],
    queryFn: async () => {
      const {data} = await api.get(`/board/free/detail`, {
        params: {boardId},
      });
      return data;
    },
    enabled: !!boardId && boardId > 0,
  });
}

/** 게시글 수정 */
export function useEditFreeBoard(boardId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BoardEdit) => {
      const {data} = await api.put(`/board/free`, payload, {
        params: {boardId},
      });
      return data;
    },
    onSuccess: () => {
      message.success("게시글이 수정되었습니다.");
      queryClient.invalidateQueries({queryKey: ["freeBoards"]});
      queryClient.invalidateQueries({queryKey: ["freeBoardDetail", boardId]});
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export const useFreeBoardCreateReply = () => useCreateReply("/board/free", "freeBoard");
export const useFreeBoardDeleteReply = (boardId: number) => useDeleteReply("/board/free", "freeBoard", boardId);
export const useFreeBoardReplies = (boardId: number) => useReplies("/board/free", "freeBoard", boardId);
export const useLikeFreeBoard = (boardId: number) => useLike("/board/free", "freeBoard", boardId);
export const useUnlikeFreeBoard = (boardId: number) => useUnlike("/board/free", "freeBoard", boardId);
export const useUploadNoticeFileToS3 = () => useUploadFileToS3("/board/free/image");
