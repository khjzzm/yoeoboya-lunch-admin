import Providers from "./providers";
import AppLayout from "@/components/layout/Layout";
import { PublicEnvScript } from 'next-runtime-env';
import React from "react";

export const metadata = {
  title: "여보야 점심시간",
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
    <head>
      <PublicEnvScript/>
      <title>{metadata.title}</title>
    </head>
    <body>
    <Providers>
      <AppLayout>{children}</AppLayout> {/* ✅ AppLayout 적용 */}
    </Providers>
    </body>
    </html>
  );
}