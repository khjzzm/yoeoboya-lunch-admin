import Providers from "./providers";
import { PublicEnvScript } from "next-runtime-env";
import React from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

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
    <Providers>
      <LayoutWrapper>{children}</LayoutWrapper> {/* ✅ 로그인 페이지 감지 로직을 `LayoutWrapper`로 이동 */}
    </Providers>
    </body>
    </html>
  );
}