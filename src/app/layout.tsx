import { PublicEnvScript } from "next-runtime-env";
import React from "react";

import Layout from "@/components/layout/Layout";

import Providers from "./providers"; //  클라이언트 전용 Providers.tsx
import "./globals.css";
import "@ant-design/v5-patch-for-react-19";

export const metadata = {
  title: "여보야 점심시간 어드민",
  description: "여보야 직원들의 비밀공간 어드민 페이지입니다.",
  robots: "index, follow",
  openGraph: {
    title: "여보야 점심시간 어드민",
    description: "여보야 직원들의 비밀공간 어드민 페이지입니다.",
    url: "https://admin.yeoboya-lunch.com",
    siteName: "Yeoboya Lunch Admin",
    images: [
      {
        url: "https://admin.yeoboya-lunch.com/og/meta-image-1200x630.png", // Facebook, Twitter 권장
        width: 1200,
        height: 630,
        alt: "OG 메인",
      },
      {
        url: "https://admin.yeoboya-lunch.com/og/meta-image-800x800.png", // 정사각형 플랫폼용
        width: 800,
        height: 800,
        alt: "OG 정사각형",
      },
      {
        url: "https://admin.yeoboya-lunch.com/og/meta-image-600x315.png", // OpenGraph 최소 사이즈
        width: 600,
        height: 315,
        alt: "OG 최소",
      },
      {
        url: "https://admin.yeoboya-lunch.com/og/meta-image-300x300.png", // Discord 최소 사이즈 대응
        width: 300,
        height: 300,
        alt: "OG 미니",
      },
      {
        url: "https://admin.yeoboya-lunch.com/og/meta-image-1024x1024.png", // 고해상도 아이콘용
        width: 1024,
        height: 1024,
        alt: "OG 고해상도",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <PublicEnvScript />
        <title>{metadata.title}</title>
      </head>
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
