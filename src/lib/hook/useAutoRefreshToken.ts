"use client";

import {useQuery} from "@tanstack/react-query";
import Cookies from "js-cookie";
import {api} from "@/lib/utils/api";
import {useAuthStore} from "@/store/useAuthStore";
import {useEffect} from "react";

export function useAutoRefreshToken() {
  const { user, setUser } = useAuthStore();

  const { data: accessToken } = useQuery<string, Error, string, string[]>({
    queryKey: ["refreshToken"],
    queryFn: refreshAccessTokenFn,
    enabled: !!Cookies.get("refreshToken"),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchInterval: 1000 * 60 * 10,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: 2,
    retryDelay: (attempt) => 1000 * 2 ** attempt,
  });

  // accessToken, setUser, user 가 갱신될 때 사용자 정보 요청
  useEffect(() => {
    if (!accessToken) return;

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
  }, [accessToken, setUser, user]);
}


/** 단독 Refresh AccessToken 요청 함수 */
async function refreshAccessTokenFn() {
  const refreshToken = Cookies.get("refreshToken");

  if (!refreshToken) {
    throw new Error("리프레시 토큰 없음");
  }

  const {data} = await api.post("/user/reissue", {refreshToken});
  Cookies.set("token", data.data.accessToken, {path: "/"});
  Cookies.set("refreshToken", data.data.refreshToken, {path: "/"});

  return data.data.accessToken; // 반드시 뭔가 return!
}