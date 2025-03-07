"use client"; // ✅ 클라이언트 컴포넌트 설정

import {UserOutlined} from "@ant-design/icons";
import {Layout, Avatar, Dropdown} from "antd";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

const {Header} = Layout;

export default function AppHeader() {

  const pathname = usePathname();
  const [pageTitle, setPageTitle] = useState("관리자 페이지");

  // ✅ `document.title`을 metadata에서 가져오기
  useEffect(() => {
    if (typeof document !== "undefined") {
      setPageTitle(document.title);
    }
  }, [pathname]);

  const menuItems = [
    {key: "1", label: "프로필"},
    {key: "2", label: "설정"},
    {key: "3", label: "로그아웃"},
  ];

  return (
    <Header style={{
      background: "#fff",
      padding: "0 16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h1 className="text-lg font-semibold">{pageTitle}</h1>

      {/* ✅ items 속성 사용 */}
      <Dropdown menu={{items: menuItems}} placement="bottomRight">
        <Avatar size="large" icon={<UserOutlined/>}/>
      </Dropdown>
    </Header>
  );
}