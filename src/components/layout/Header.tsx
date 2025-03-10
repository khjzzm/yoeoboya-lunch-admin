"use client"; // ✅ 클라이언트 컴포넌트 설정

import { UserOutlined, LogoutOutlined, SettingOutlined, ProfileOutlined } from "@ant-design/icons";
import { Layout, Avatar, Dropdown, MenuProps } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useLogout } from "@/lib/api/useLogin"; // ✅ 로그아웃 훅 추가

const { Header } = Layout;

export default function AppHeader() {
  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("관리자 페이지");
  const logoutMutation = useLogout(); // ✅ useLogout 훅 사용

  // ✅ `document.title`을 metadata에서 가져오기
  useEffect(() => {
    if (typeof document !== "undefined") {
      setPageTitle(document.title);
    }
  }, [pathname]);

  // ✅ 로그아웃 실행 함수
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const menuItems: MenuProps["items"] = [
    { key: "1", icon: <ProfileOutlined />, label: "프로필" },
    { key: "2", icon: <SettingOutlined />, label: "설정" },
    { key: "3", icon: <LogoutOutlined />, label: "로그아웃", onClick: handleLogout }, // ✅ 로그아웃 클릭 이벤트 추가
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
        <Avatar size="large" icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
}