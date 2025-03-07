"use client";

import { Layout } from "antd";
import Sidebar from "./Sidebar";
import AppHeader from "./Header"; // ✅ 올바르게 import

const { Content } = Layout;

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* 왼쪽 사이드바 */}
      <Sidebar />

      <Layout>
        {/* ✅ AppHeader로 변경 */}
        <AppHeader />

        {/* 메인 컨텐츠 영역 */}
        <Content style={{ margin: "16px", padding: "24px", background: "#fff" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}