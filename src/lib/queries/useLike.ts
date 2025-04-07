import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

export function useLike(endpoint: string, queryKeyPrefix: string, boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`${endpoint}/like`, null, {
        params: { boardId },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Detail`, boardId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}

export function useUnlike(endpoint: string, queryKeyPrefix: string, boardId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete(`${endpoint}/unlike`, {
        params: { boardId },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Detail`, boardId] });
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}
