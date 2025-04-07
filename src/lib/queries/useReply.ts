import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

import { ApiResponse, Pagination, Reply, ReplyCreateRequest } from "@/types";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

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

export function useDeleteReply(endpoint: string, queryKeyPrefix: string, boardId: number) {
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
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Replies`, boardId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export function useReplies(endpoint: string, queryKeyPrefix: string, boardId: number) {
  return useQuery<ApiResponse<{ list: Reply[]; pagination: Pagination }>>({
    queryKey: [`${queryKeyPrefix}Replies`, boardId],
    queryFn: async () => {
      const { data } = await api.get(`${endpoint}/replies`, {
        params: { boardId },
      });
      return data;
    },
    enabled: !!boardId,
  });
}
