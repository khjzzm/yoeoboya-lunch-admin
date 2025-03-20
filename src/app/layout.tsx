import Providers from "./providers"; //  클라이언트 전용 Providers.tsx
import {PublicEnvScript} from "next-runtime-env";
import React from "react";
import Layout from "@/components/layout/Layout";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19' ;

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
        url: "/meta-image.png",
        width: 1200,
        height: 630,
        alt: "여보야 점심시간 어드민"
      }
    ],
    type: "website"
  },
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="ko">
    <head>
      <PublicEnvScript/>
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
