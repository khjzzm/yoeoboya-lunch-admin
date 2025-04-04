import axios from "axios";

import { useAuthStore } from "@/store/useAuthStore";

const API_URL =
  typeof window !== "undefined"
    ? window.__ENV?.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // 쿠키 포함 요청
});

// 응답 인터셉터: 403 / 401 권한 없음 처리
api.interceptors.response.use(
  (response) => response, // 성공 응답 그대로 반환
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 403) {
        console.error("🚫 접근 권한이 없습니다.");
      } else if (status === 401) {
        console.error("🔒 인증이 만료되었습니다. 다시 로그인하세요.");
        const { setExpired, logout } = useAuthStore.getState();
        logout();
        setExpired(true);
      }
    }
    return Promise.reject(error);
  },
);
