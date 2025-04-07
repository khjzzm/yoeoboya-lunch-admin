import { useQuery } from "@tanstack/react-query";

import { ApiResponse } from "@/types/common/ApiResponse";

import { api } from "@/lib/utils/api";

export interface BoardTypeResponse {
  code: string; // enum 이름 (e.g., "FREE", "NOTICE")
  name: string; // 사용자에게 보여질 이름 (e.g., "자유게시판", "공지사항")
}

export const useBoardTypes = () => {
  return useQuery<ApiResponse<BoardTypeResponse[]>>({
    queryKey: ["boardTypes"],
    queryFn: async () => {
      const { data } = await api.get("/board/types");
      return data;
    },
  });
};
