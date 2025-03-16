"use client";

import { usePathname } from "next/navigation";
import AppLayout from "@/components/layout/Layout";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/user/login") || pathname.startsWith("/user/signup");

  return isAuthPage ? <>{children}</> : <AppLayout>{children}</AppLayout>;
}
