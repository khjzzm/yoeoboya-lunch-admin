import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

// 좋아요
export function useLike(endpoint: string, queryKeyPrefix: string, boardNo: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`${endpoint}/like`, null, {
        params: { boardNo },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Detail`, boardNo] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

// 좋아요취소
export function useUnlike(endpoint: string, queryKeyPrefix: string, boardNo: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`${endpoint}/unlike`, {
        params: { boardNo },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Detail`, boardNo] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}
