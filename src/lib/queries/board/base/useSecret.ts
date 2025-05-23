import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/utils/api";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

// 게시판 비밀번호 확인
export function useVerifyPassword(endpoint: string) {
  return useMutation({
    mutationFn: async ({ boardNo, password }: { boardNo: number; password: string }) => {
      const { data } = await api.post(`${endpoint}/verify-password`, {
        boardNo,
        password,
      });
      return data;
    },
    onError: (error) => {
      apiErrorMessage(error);
    },
  });
}
