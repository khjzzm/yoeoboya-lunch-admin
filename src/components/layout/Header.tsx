"use client";

import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import { Layout, Avatar, Dropdown, MenuProps, Typography, Space } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLogout } from "@/lib/api/useLogin";
import { useAuthStore } from "@/store/useAuthStore";

const { Header } = Layout;
const { Text } = Typography;

export default function AppHeader() {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("");
  const logoutMutation = useLogout();
  const { user } = useAuthStore();

  // 현재 페이지의 타이틀 설정
  useEffect(() => {
    if (typeof document !== "undefined") {
      setPageTitle(document.title);
    }
  }, [pathname]);

  // 로그아웃 실행 함수
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems: MenuProps["items"] = [
    { key: "1", icon: <ProfileOutlined />, label: "프로필" },
    { key: "2", icon: <SettingOutlined />, label: "설정" },
    { key: "3", icon: <LogoutOutlined />, label: "로그아웃", onClick: handleLogout },
  ];

  return (
    <Header className="bg-[#0d47a1] px-6 flex justify-between items-center shadow-md">
      <Text className="text-white text-lg font-semibold">{pageTitle}</Text>

      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Space className="cursor-pointer">
          <Avatar size="large" className="bg-white text-blue-500">
            <UserOutlined />
          </Avatar>
          <Text strong className="text-white">
            {user?.name || user?.loginId}
          </Text>
        </Space>
      </Dropdown>
    </Header>
  );
}