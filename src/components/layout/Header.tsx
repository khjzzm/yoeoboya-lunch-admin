"use client";

import { Layout, Typography } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import ProfileDropdown from "@/components/me/ProfileDropdown";
import { menuItems, MenuItem } from "@/components/layout/menuConfig";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("");

  // 경로 기준 label 찾기
  const findLabelByPath = (path: string, items: MenuItem[]): string | null => {
    for (const item of items) {
      if (item.children) {
        const childLabel = findLabelByPath(path, item.children);
        if (childLabel) return childLabel;
      }
      if (item.key === "/" && path === "/") return item.label;
      if (item.key !== "/" && path.startsWith(item.key)) return item.label;
    }
    return null;
  };

  useEffect(() => {
    const label = findLabelByPath(pathname, menuItems);
    setPageTitle(label ?? ""); // 못 찾으면 빈 문자열
  }, [pathname]);

  return (
    <Header className="bg-[#0d47a1] px-6 flex justify-between items-center shadow-md">
      <Text className="text-white text-lg font-semibold">{pageTitle}</Text>
      <ProfileDropdown />
    </Header>
  );
}
