"use client"; // ✅ 클라이언트 컴포넌트

import { usePathname } from "next/navigation";
import AppLayout from "@/components/layout/Layout";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // ✅ 현재 경로 가져오기
  const isLoginPage = pathname.startsWith("/login"); // ✅ 로그인 페이지 확인

  return isLoginPage ? <>{children}</> : <AppLayout>{children}</AppLayout>;
}