import Providers from "./providers"; //  클라이언트 전용 Providers.tsx
import { PublicEnvScript } from "next-runtime-env";
import React from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import "./globals.css";

export const metadata = {
  title: "여보야 점심시간",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
    <head>
      <PublicEnvScript />
      <title>{metadata.title}</title>
    </head>
    <body>
    <Providers> {/*  QueryClientProvider가 감싸지도록 적용 */}
      <LayoutWrapper>{children}</LayoutWrapper>
    </Providers>
    </body>
    </html>
  );
}
