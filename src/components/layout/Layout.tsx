"use client";

import { Layout } from "antd";
import { usePathname } from "next/navigation";
import React from "react";

import AppHeader from "./Header";
import Sidebar from "./Sidebar";

const { Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
  contentStyle?: React.CSSProperties;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/user/login") || pathname.startsWith("/user/signup");

  return isAuthPage ? (
    <>{children}</>
  ) : (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Layout>
        <AppHeader />
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
}
