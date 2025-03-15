"use client";

import { useQuery } from "@tanstack/react-query";
import { useRefreshToken } from "@/lib/api/useUser";
import { useAuthStore } from "@/store/useAuthStore";

export function useAutoRefreshToken() {
  const { mutateAsync: refreshAccessToken } = useRefreshToken();
  const { user }= useAuthStore();

  useQuery({
    queryKey: ["refreshToken"],
    queryFn: async () => await refreshAccessToken(),
    enabled: !!user, //로그인한 경우에만 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터가 신선함
    gcTime: 1000 * 60 * 10, // 캐시는 10분 유지
    refetchInterval: 1000 * 60 * 10, // 10분마다 자동 갱신
    refetchIntervalInBackground: true, // 백그라운드에서도 자동 갱신 유지
    refetchOnWindowFocus: true, // 창 포커스 이동 시 새로고침
    refetchOnReconnect: true, // 네트워크 재연결 시 갱신
    retry: 2, // 요청 실패 시 2번까지 재시도
    retryDelay: (attempt) => 1000 * 2 ** attempt, // 재시도 간격 (1s → 2s → 4s)
  });
}
