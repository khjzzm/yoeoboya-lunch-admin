"use client";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, Typography } from "antd";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { menuItems as rawMenuItems, MenuItem } from "@/components/layout/menuConfig";

const { Sider } = Layout;
const { Title } = Typography;

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>("");
  const [collapsed, setCollapsed] = useState(false);

  // 메뉴에 router.push 연결 (menuConfig는 onClick 없이 정의되어 있음)
  const menuItemsWithOnClick: MenuItem[] = useMemo(() => {
    const attachClick = (items: MenuItem[]): MenuItem[] =>
      items.map((item) => ({
        ...item,
        onClick: item.key.startsWith("/") ? () => router.push(item.key) : undefined,
        children: item.children ? attachClick(item.children) : undefined,
      }));

    return attachClick(rawMenuItems);
  }, [router]);

  // 현재 경로에 맞는 key 찾기
  const findActiveKey = useCallback((path: string, items: MenuItem[]): string => {
    // 경로 우선순위: 가장 긴 key부터 매칭하도록 정렬
    const sortedItems = [...items].sort((a, b) => b.key.length - a.key.length);

    for (const item of sortedItems) {
      if (item.children) {
        const activeKey = findActiveKey(path, item.children);
        if (activeKey) return activeKey;
      }
      if (item.key === "/" && path === "/") return item.key;
      if (item.key !== "/" && path.startsWith(item.key)) return item.key;
    }
    return "";
  }, []);

  useEffect(() => {
    const activeKey = findActiveKey(pathname, menuItemsWithOnClick);
    setSelectedKey(activeKey);
  }, [pathname, findActiveKey, menuItemsWithOnClick]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      className="bg-white shadow-md"
      width={250}
      trigger={null}
    >
      <div
        className={`flex items-center p-4 border-b ${collapsed ? "justify-center" : "justify-between"}`}
      >
        {!collapsed && (
          <Title level={4} style={{ marginBottom: 0 }} className="text-gray-800 text-center w-full">
            관리자 메뉴
          </Title>
        )}
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          className="text-gray-800"
        />
      </div>

      <Menu
        mode="inline"
        selectedKeys={selectedKey ? [selectedKey] : []}
        defaultOpenKeys={["support", "board", "authorization"]}
        items={menuItemsWithOnClick}
        className="bg-white text-gray-800"
      />
    </Sider>
  );
}
