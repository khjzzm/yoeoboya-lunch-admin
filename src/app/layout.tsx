import Providers from "./providers"; //  클라이언트 전용 Providers.tsx
import { PublicEnvScript } from "next-runtime-env";
import React from "react";
import Layout from "@/components/layout/Layout";
import "./globals.css";
import '@ant-design/v5-patch-for-react-19' ;

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
      <Layout>{children}</Layout>
    </Providers>
    </body>
    </html>
  );
}
