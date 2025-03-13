"use client";

import { usePathname } from "next/navigation";
import AppLayout from "@/components/layout/Layout";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");

  return isAuthPage ? <>{children}</> : <AppLayout>{children}</AppLayout>;
}