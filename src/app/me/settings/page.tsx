"use client";

import {useRef, useState, useEffect, useMemo, RefObject, createRef} from "react";
import { Layout, Menu, Typography } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import ProfileSettings from "@/components/settings/ProfileSettings";
import SecuritySettings from "@/components/settings/SecuritySettings";
import AppLayout from "@/components/layout/Layout";

const { Content, Sider } = Layout;

export default function SettingsPage() {
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedKey, setSelectedKey] = useState<string>("profile");

  // 섹션 데이터 배열 정의 (추후 섹션이 추가될 때도 여기만 확장하면 됩니다)
  const sections = useMemo(
    () => [
      {
        key: "profile",
        label: "프로필",
        icon: <UserOutlined />,
        component: <ProfileSettings />,
      },
      {
        key: "security1",
        label: "비밀번호 및 인증",
        icon: <LockOutlined />,
        component: <SecuritySettings />,
      },
      {
        key: "security2",
        label: "비밀번호 및 인증",
        icon: <LockOutlined />,
        component: <SecuritySettings />,
      },
      {
        key: "security3",
        label: "비밀번호 및 인증",
        icon: <LockOutlined />,
        component: <SecuritySettings />,
      },
      {
        key: "security4",
        label: "비밀번호 및 인증",
        icon: <LockOutlined />,
        component: <SecuritySettings />,
      },
      {
        key: "security5",
        label: "비밀번호 및 인증",
        icon: <LockOutlined />,
        component: <SecuritySettings />,
      },      {
        key: "security6",
        label: "비밀번호 및 인증",
        icon: <LockOutlined />,
        component: <SecuritySettings />,
      },      {
        key: "security7",
        label: "비밀번호 및 인증",
        icon: <LockOutlined />,
        component: <SecuritySettings />,
      },

    ],
    []
  );

  // 동적 ref 배열: 각 섹션마다 React.createRef() 생성 (useMemo로 캐싱)
  const sectionRefs = useMemo(() => {
    const refs: { [key: string]: RefObject<HTMLDivElement | null> } = {};
    sections.forEach((section) => {
      refs[section.key] = createRef<HTMLDivElement>();
    });
    return refs;
  }, [sections]);

  /** 메뉴 클릭 시 해당 섹션으로 부드럽게 스크롤 이동 */
  const scrollToSection = (key: string) => {
    setSelectedKey(key);
    const ref = sectionRefs[key];
    if (ref?.current && contentRef.current) {
      const containerRect = contentRef.current.getBoundingClientRect();
      const sectionRect = ref.current.getBoundingClientRect();
      // contentRef의 현재 scrollTop을 반영한 offset 계산
      const offset = sectionRect.top - containerRect.top + contentRef.current.scrollTop;
      contentRef.current.scrollTo({
        top: offset,
        behavior: "smooth",
      });
    }
  };

  /** inner 컨테이너의 scroll 이벤트 감지:
   * 컨테이너 상단에서 절반 높이 내에 있는 섹션을 selectedKey로 설정하고,
   * 스크롤이 마지막에 도달했을 경우 마지막 섹션을 활성화
   */
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const containerHeight = container.clientHeight;
      let activeKey = selectedKey;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        const ref = sectionRefs[section.key];
        if (ref?.current) {
          const sectionRect = ref.current.getBoundingClientRect();
          const relativeTop = sectionRect.top - containerRect.top;
          if (relativeTop >= 0 && relativeTop < containerHeight / 2) {
            activeKey = section.key;
            break;
          }
        }
      }

      // 마지막 컨텐츠가 짧아 스크롤이 끝까지 내려갔을 때 마지막 섹션을 강제로 활성화
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
        activeKey = sections[sections.length - 1].key;
      }

      if (activeKey !== selectedKey) {
        setSelectedKey(activeKey);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [selectedKey, sections, sectionRefs]);

  // 메뉴 아이템 생성
  const menuItems = sections.map((section) => ({
    key: section.key,
    icon: section.icon,
    label: section.label,
    onClick: () => scrollToSection(section.key),
  }));

  return (
    <AppLayout contentStyle={{ margin: "0px", padding: "0px", background: "#f0f0f0" }}>
    <Layout className="h-screen flex m-0 p-0">
      {/* 사이드바 메뉴 */}
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

      {/* 스크롤 가능한 컨텐츠 영역 */}
      <Content
        ref={contentRef}
        className="flex-1 flex flex-col justify-start overflow-y-scroll px-12 py-8"
      >
        {sections.map((section) => (
          <div
            key={section.key}
            ref={sectionRefs[section.key]}
            className="w-full mb-12"
          >
            <Typography.Title level={5}>{section.label}</Typography.Title>
            {section.component}
          </div>
        ))}
      </Content>
    </Layout>
    </AppLayout>
  );
}