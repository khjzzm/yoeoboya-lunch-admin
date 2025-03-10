import Providers from "./providers";
import { PublicEnvScript } from "next-runtime-env";
import React from "react";
import AppLayout from "@/components/layout/Layout";

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
      <AppLayout>{children}</AppLayout>
    </Providers>
    </body>
    </html>
  );
}