import axios from "axios";

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"; // 기본값 설정
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
