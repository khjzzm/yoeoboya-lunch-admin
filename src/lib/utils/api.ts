import axios from "axios";

// Docker 네트워크에서 Spring Boot 컨테이너 접근 (localhost❌)
const API_URL =
  typeof window === "undefined"
    ? "http://springboot_container:8080" // 서버 사이드 (Docker 네트워크 내부)
    : "http://localhost:8080"; // 클라이언트 사이드 (개발 환경)

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 요청 인터셉터 추가 (JWT 토큰 자동 추가)
api.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token"); // 저장된 JWT 토큰 가져오기
    // if (token) {
      config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImp0aSI6IjgyY2M5MmZiLTgzMWUtNGNhYS05MzNlLTVkYmYwODM5OTBiYiIsImlzcyI6Inllb2JveWEiLCJpYXQiOjE3NDEzMDg5OTYsImV4cCI6MTc0MTc0MDk5NiwiYXV0aCI6IlJPTEVfQURNSU4ifQ.HXFdFad_VQ22-wh7oxWYQhBAqCppXAQw3Vxu80Xg3Jg`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);