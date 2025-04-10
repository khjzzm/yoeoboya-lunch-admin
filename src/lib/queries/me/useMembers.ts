import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/utils/api";

// 내정보 가져오기
export function useMeInfo() {
  return useQuery({
    queryKey: ["fetchMeInfo"],
    queryFn: async () => {
      const { data } = await api.get(`/me`);
      return data;
    },
  });
}

// 회원정보 가져오기
export function useMembers(
  page: number,
  pageSize: number,
  filters?: Record<string, string | string[]>,
) {
  return useQuery({
    queryKey: ["fetchMembers", page, pageSize, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        size: String(pageSize),
        ...(filters || {}),
      });

      const { data } = await api.get(`/member?${params.toString()}`);
      return data;
    },
  });
}

// 특정 회원 요약 정보 조회
export function useFetchMemberSummary(memberLoginId: string) {
  return useQuery({
    queryKey: ["fetchMemberSummary", memberLoginId], //  캐시를 위한 키
    queryFn: async () => {
      const { data } = await api.get(`/member/${memberLoginId}`);
      return data.data;
    },
    enabled: !!memberLoginId,
    staleTime: 1000 * 60 * 5,
  });
}
