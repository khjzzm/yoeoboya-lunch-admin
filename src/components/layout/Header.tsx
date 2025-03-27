"use client";

import {Layout, Typography} from "antd";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";
import ProfileDropdown from "@/components/ProfileDropdown";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    if (typeof document !== "undefined") {
      setPageTitle(document.title);
    }
  }, [pathname]);

  return (
    <Header className="bg-[#0d47a1] px-6 flex justify-between items-center shadow-md">
      <Text className="text-white text-lg font-semibold">{pageTitle}</Text>
      <ProfileDropdown />
    </Header>
  );
}