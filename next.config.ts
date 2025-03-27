import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,  // React Strict Mode 활성화
  output: "standalone",   // Next.js를 독립 실행형으로 빌드
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yeoboya-lunch-s3.s3.amazonaws.com",
      },
    ],
    domains: ["yeoboya-lunch-s3.s3.amazonaws.com"],
  },
};

export default nextConfig;