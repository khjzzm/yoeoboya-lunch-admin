import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,  // React Strict Mode 활성화
  output: "standalone",   // Next.js를 독립 실행형으로 빌드
};

export default nextConfig;