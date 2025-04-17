import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";
import { getOrCreateAnonymousUUID } from "@/lib/utils/uuid";

// 좋아요
export function useLike(
  endpoint: string,
  queryKeyPrefix: string,
  boardNo: number,
  useAnonymousHeader = false,
  onSuccessOverride?: () => void,
) {
  const queryClient = useQueryClient();
  const clientUUID = useAnonymousHeader ? getOrCreateAnonymousUUID() : undefined;

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.post(`${endpoint}/like`, null, {
        params: { boardNo },
        headers: useAnonymousHeader ? { "X-Anonymous-Client-UUID": clientUUID } : undefined,
      });
      return data;
    },
    onSuccess: () => {
      if (onSuccessOverride) {
        onSuccessOverride();
      } else {
        queryClient.invalidateQueries({ queryKey: [`${queryKeyPrefix}Detail`, boardNo] });
      }
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
