"use client";

import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./Header";
import { usePathname } from "next/navigation";
import React from "react";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
}

export default function AppLayout({ children, contentStyle }: AppLayoutProps) {
  const pathname = usePathname();
  const isAuthPage =
    pathname.startsWith("/user/login") || pathname.startsWith("/user/signup");

  // 기본 Content 스타일
  const defaultStyle: React.CSSProperties = {
    margin: "16px",
    padding: "24px",
    background: "#fff",
  };

  return isAuthPage ? (
    <>{children}</>
  ) : (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content style={{ ...defaultStyle, ...contentStyle }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}