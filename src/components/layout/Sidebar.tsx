"use client";

import {Layout, Menu, Typography, Button} from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {useRouter} from "next/navigation";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

const {Sider} = Layout;
const {Title} = Typography;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false); //  사이드바 접기/펼치기 상태

  useEffect(() => {
    setSelectedKey(pathname);
  }, [pathname]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {key: "/", icon: <HomeOutlined/>, label: "홈", onClick: () => router.push("/")},
    {key: "/member", icon: <UserOutlined/>, label: "회원정보", onClick: () => router.push("/member")},
    {
      key: "authorization",
      icon: <SafetyCertificateOutlined/>,
      label: "보안관리",
      children: [
        {key: "/security/role/authorities", label: "회원권한", onClick: () => router.push("/security/role/authorities")},
        {key: "/security/resource", label: "리소스", onClick: () => router.push("/security/resource")},
        {key: "/security/resource/token", label: "토큰", onClick: () => router.push("/security/resource/token")},
      ],
    },
    {
      key: "/settings",
      icon: <SettingOutlined/>,
      label: "설정",
      children: [
        {key: "/member/setting/profile", label: "프로필", onClick: () => router.push("/member/setting/profile")},
        {key: "/member/setting/security", label: "비밀번호 및 인증", onClick: () => router.push("/member/setting/security")},
      ],
    }
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="bg-white shadow-md"
      width={250}
      trigger={null} // 기본 토글 버튼 제거 (커스텀 버튼 사용)
    >
      {/* 토글 버튼 */}
      <div className={`flex items-center p-4 border-b ${collapsed ? "justify-center" : "justify-between"}`}>
        {/* 펼쳐진 상태에서는 가운데 정렬된 타이틀 */}
        {!collapsed && <Title level={4} style={{marginBottom: 0}} className="text-gray-800 text-center w-full">관리자 메뉴</Title>}

        {/* 접혔을 때는 중앙에 아이콘 정렬 */}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
          onClick={toggleSidebar}
          className="text-gray-800"
        />
      </div>

      {/* 메뉴 리스트 */}
      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={["authorization"]}
        items={menuItems.map(({key, icon, label, children, onClick}) => ({
          key,
          icon,
          label: collapsed && !children ? undefined : label,
          children,
          onClick,
        }))}
        className="bg-white text-gray-800"
      />
    </Sider>
  );
}
