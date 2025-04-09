// src/hooks/useHashtagSearch.ts
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";

import { ApiResponse } from "@/types";

import { api } from "@/lib/utils/api";

export interface Hashtag {
  tag: string;
  count: number;
}

export function useHashtagSearch(endpoint: string, keyword: string, enabled: boolean = true) {
  const [debouncedKeyword] = useDebounce(keyword, 300); // 입력 후 300ms debounce

  const query = useQuery<ApiResponse<Hashtag[]>>({
    queryKey: ["hashtagSearch", debouncedKeyword],
    queryFn: async () => {
      const res = await api.get(`${endpoint}/hashtag`, {
        params: { keyword: debouncedKeyword },
      });
      return res.data;
    },
    enabled: enabled && debouncedKeyword.length > 0, // 빈 키워드일 땐 요청 안 보냄
    staleTime: 1000 * 10, // 10초간 캐시 유지
  });

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}

export function usePopularHashtags(endpoint: string, limit: number = 20) {
  const query = useQuery<ApiResponse<Hashtag[]>>({
    queryKey: ["popularHashtags", limit],
    queryFn: async () => {
      const res = await api.get(`${endpoint}/popular`, {
        params: { limit },
      });
      return res.data;
    },
    staleTime: 1000 * 30, // 30초 동안 캐시 유지
  });

  return {
    data: query.data?.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    refetch: query.refetch,
  };
}
