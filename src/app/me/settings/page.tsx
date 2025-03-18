"use client";

import { useRef, useState, useEffect } from "react";
import { Layout, Menu, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";

const { Content, Sider } = Layout;

export default function SettingsPage() {
  const profileRef = useRef<HTMLDivElement>(null);
  const securityRef = useRef<HTMLDivElement>(null);
  const [selectedKey, setSelectedKey] = useState<string>("profile");

  /** 특정 섹션으로 스크롤 이동 */
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>, key: string) => {
    setSelectedKey(key);
    if (ref.current) {
      setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  /** 현재 보이는 섹션을 감지하여 `selectedKey` 업데이트 */
  useEffect(() => {
    const handleScroll = () => {
      if (!profileRef.current || !securityRef.current) return;

      const profileTop = profileRef.current.getBoundingClientRect().top;
      const securityTop = securityRef.current.getBoundingClientRect().top;

      if (profileTop >= 0 && profileTop < window.innerHeight / 2) {
        setSelectedKey("profile");
      } else if (securityTop >= 0 && securityTop < window.innerHeight / 2) {
        setSelectedKey("security");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { key: "profile", icon: <UserOutlined />, label: "프로필", onClick: () => scrollToSection(profileRef, "profile") },
    { key: "security", icon: <LockOutlined />, label: "비밀번호 및 인증", onClick: () => scrollToSection(securityRef, "security") },
  ];

  return (
    <Layout className="h-screen flex m-0 p-0">
      {/* 설정 사이드바 */}
      <Sider width={250} className="bg-white shadow-md flex flex-col m-0 p-0">
        <Typography.Title level={4} className="text-gray-800 text-center my-4">
          설정
        </Typography.Title>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          className="bg-white text-gray-800 border-none"
        />
      </Sider>

      {/* 설정 페이지 내용 */}
      <Content className="flex-1 flex flex-col justify-start overflow-y-scroll px-12 py-8">
        {/* 전체 화면을 쓰도록 `max-w-3xl` 제거 */}
        <div ref={profileRef} className="w-full mb-12">
          <ProfileSettings />
        </div>

        <div ref={securityRef} className="w-full">
          <SecuritySettings />
        </div>
      </Content>
    </Layout>
  );
}