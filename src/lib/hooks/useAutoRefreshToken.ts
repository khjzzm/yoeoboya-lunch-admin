"use client";

import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

import { api } from "@/lib/utils/api";

import { useAuthStore } from "@/store/useAuthStore";

export function useAutoRefreshToken() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const pathname = usePathname();

  const shouldSkip = useMemo(() => {
    return ["/user/login", "/user/signup", "/user/signup/social"].some((excluded) =>
      pathname.startsWith(excluded),
    );
  }, [pathname]);

  const isLoggedIn = user !== null && typeof user === "object" && "loginId" in user;

  const { data: refreshTrigger } = useQuery<string>({
    queryKey: ["refresh-trigger", user?.loginId],
    queryFn: refreshTokenFn,
    enabled: !shouldSkip && !isLoggedIn,
    staleTime: 1000 * 60 * 5, // 5분 동안 "신선한" 상태
    refetchInterval: 1000 * 60 * 10, // 10분마다 백그라운드 자동 갱신
    gcTime: 1000 * 60 * 30, // 30분 후 가비지 컬렉션
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
          setUser(memberData.data);
        }
      } catch (error) {
        console.error("❌ 사용자 정보 업데이트 실패", error);
      }
    })();
  }, [refreshTrigger, setUser]);
}

/** 서버에서 쿠키 기반으로 리프레시 처리 (body 없이 요청) */
async function refreshTokenFn(): Promise<string> {
  await api.post("/user/reissue");
  return `refreshed-${Date.now()}`;
}
