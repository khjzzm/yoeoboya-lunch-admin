"use client";

import { Layout, Menu } from "antd";
import { HomeOutlined, SettingOutlined, UserOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation"; // ✅ 현재 경로 가져오기
import { useEffect, useState } from "react";

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ 현재 경로 가져오기
  const [selectedKey, setSelectedKey] = useState<string>(""); // ✅ 클라이언트에서만 설정

  useEffect(() => {
    setSelectedKey(pathname); // ✅ 클라이언트에서 selectedKey 설정
  }, [pathname]);

  // ✅ Menu items 배열
  const menuItems = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: "홈",
      onClick: () => router.push("/"),
    },
    {
      key: "/member",
      icon: <UserOutlined />,
      label: "회원정보",
      onClick: () => router.push("/member"),
    },
    {
      key: "authorization",
      icon: <SafetyCertificateOutlined />,
      label: "보안관리",
      children: [
        {
          key: "/security/role/authorities",
          label: "회원권한",
          onClick: () => router.push("/security/role/authorities"),
        },
        {
          key: "/security/resource",
          label: "리소스",
          onClick: () => router.push("/security/resource"),
        },
        {
          key: "/security/resource/token",
          label: "토큰",
          onClick: () => router.push("/security/resource/token"),
        },
      ],
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "설정",
      onClick: () => router.push("/settings"),
    },
  ];

  return (
    <Sider collapsible style={{ background: "#001529" }}>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []} // ✅ 초기에는 빈 값, 이후 업데이트됨
        defaultOpenKeys={["authorization"]}
        items={menuItems.map(({ key, icon, label, children, onClick }) => ({
          key,
          icon,
          label,
          children,
          onClick,
        }))}
      />
    </Sider>
  );
}