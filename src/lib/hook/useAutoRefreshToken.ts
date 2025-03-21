"use client";

import { useQuery } from "@tanstack/react-query";
// import { useAuthStore } from "@/store/useAuthStore";
import { refreshAccessTokenFn } from "@/lib/api/useLogin";
import Cookies from "js-cookie";

export function useAutoRefreshToken() {
  const hasToken = !!Cookies.get("provider") && !!Cookies.get("refreshToken");
  console.log(Cookies.get("provider"))
  console.log(Cookies.get("refreshToken"))

  useQuery({
    queryKey: ["refreshToken"],
    queryFn: refreshAccessTokenFn,
    enabled: hasToken,
    staleTime: 1000 * 60 * 5, // 5분 동안 신선
    gcTime: 1000 * 60 * 10, // 10분 후 캐시 정리
    refetchInterval: 1000 * 60 * 10, // 10분마다 갱신
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attempt) => 1000 * 2 ** attempt,
  });
}