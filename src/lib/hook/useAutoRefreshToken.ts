"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/utils/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";

export function useAutoRefreshToken() {
  const { user, setUser } = useAuthStore();

  const { data: refreshTrigger } = useQuery<string>({
    queryKey: ["refreshToken"],
    queryFn: refreshAccessTokenFn,
    enabled: true,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 10,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (!refreshTrigger) return;

    (async () => {
      try {
        const { data: memberData } = await api.get("/me");

        if (memberData?.data) {
          setUser({
            ...user,
            ...memberData.data,
          });
        }
      } catch (error) {
        console.error("사용자 정보 업데이트 실패", error);
      }
    })();
  }, [refreshTrigger]);
}

/** HttpOnly 쿠키 기반 refresh 요청 (body 없이 요청) */
async function refreshAccessTokenFn(): Promise<string> {
  const { data } = await api.post("/user/reissue");
  return data.data;
}