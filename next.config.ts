import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,  // React Strict Mode 활성화
  output: "standalone",   // Next.js를 독립 실행형으로 빌드
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // 환경 변수 적용
  },
};

export default nextConfig;