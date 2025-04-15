import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { ApiResponse, Pagination, Reply, ReplyCreateRequest } from "@/types";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

// 댓글작성
export function useCreateReply(endpoint: string, queryKeyPrefix: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReplyCreateRequest) => {
      const { data } = await api.post(`${endpoint}/reply`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      message.success("댓글이 등록되었습니다.");
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Replies`, variables.boardNo] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 댓글삭제
export function useDeleteReply(endpoint: string, queryKeyPrefix: string, boardNo: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (replyId: number) => {
      const { data } = await api.delete(`${endpoint}/reply`, {
        params: { replyId },
      });
      return data;
    },
    onSuccess: () => {
      message.success("댓글이 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Replies`, boardNo] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 댓글조회
export function useReplies(
  endpoint: string,
  queryKeyPrefix: string,
  boardNo: number,
  page: number = 1,
  size: number = 100,
) {
  return useQuery<{ list: Reply[]; pagination: Pagination }>({
    queryKey: [`${queryKeyPrefix}Replies`, boardNo, page, size],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.set("boardNo", String(boardNo));
      params.set("page", String(page));
      params.set("size", String(size));

      const { data } = await api.get<ApiResponse<{ list: Reply[]; pagination: Pagination }>>(
        `${endpoint}/replies?${params.toString()}`,
      );
      return data.data;
    },
    enabled: !!boardNo,
  });
}
