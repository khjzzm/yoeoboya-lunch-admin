"use client";

import { UserOutlined, LogoutOutlined, SettingOutlined, ProfileOutlined } from "@ant-design/icons";
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
    <Header
      style={{
        background: "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h1 className="text-lg font-semibold">{pageTitle}</h1>

      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
        <Space>
          <Avatar size="large" icon={<UserOutlined />} />
          <Text strong>
            {user?.name || user?.loginId}
          </Text>
        </Space>
      </Dropdown>
    </Header>
  );
}