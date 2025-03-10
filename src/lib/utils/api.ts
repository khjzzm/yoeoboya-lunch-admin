import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // ✅ 쿠키 포함 요청
});

// ✅ 요청 인터셉터 추가 (JWT 토큰 자동 추가)
api.interceptors.request.use(
  async (config) => {
    const token = Cookies.get("token");

    if (!token) {
      console.warn("🔑 Access Token 없음, 토큰 갱신 시도...");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(window.__ENV);

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 인터셉터: 403 / 401 권한 없음 처리
api.interceptors.response.use(
  (response) => response, // 성공 응답 그대로 반환
  async (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 403) {
        alert("🚫 접근 권한이 없습니다.");
        window.location.href = "/";
      } else if (status === 401) {
        alert("🔒 인증이 만료되었습니다. 다시 로그인하세요.");
        Cookies.remove("token"); // ✅ 401 발생 시 토큰 삭제
        window.location.href = "/login"; // ✅ 401 발생 시 재로그인 필요
      }
    }

    return Promise.reject(error);
  }
);