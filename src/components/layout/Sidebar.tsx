"use client";

import { Layout, Menu } from "antd";
import { HomeOutlined, SettingOutlined, UserOutlined, SafetyCertificateOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Sider } = Layout;

export default function Sidebar() {
  const router = useRouter();

  // ✅ Menu items 배열 (인가정보 추가)
  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: "홈",
      onClick: () => router.push("/"),
    },
    {
      key: "member",
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
          key: "role-authorities",
          label: "회원권한",
          onClick: () => router.push("/security/role/authorities"),
        },
        {
          key: "resources",
          label: "리소스",
          onClick: () => router.push("/security/resource"),
        },
        {
          key: "token",
          label: "토큰",
          onClick: () => router.push("/security/resource/token"),
        },
      ],
    },
    {
      key: "settings",
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
        defaultSelectedKeys={["home"]}
        items={menuItems.map(({ key, icon, label, children, onClick }) => ({
          key,
          icon,
          label,
          children,
          onClick,
        }))}
        defaultOpenKeys={["authorization"]}
      />
    </Sider>
  );
}