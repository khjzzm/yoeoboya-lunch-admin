// src/config/menuConfig.ts
import {
  HomeOutlined,
  UserOutlined,
  NotificationOutlined,
  CommentOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
} from "@ant-design/icons";

export type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  children?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  { key: "/", icon: <HomeOutlined />, label: "홈" },
  { key: "/member", icon: <UserOutlined />, label: "회원정보" },
  {
    key: "support",
    icon: <NotificationOutlined />,
    label: "고객지원",
    children: [
      { key: "/support/notice", label: "공지사항" },
      { key: "/support/faq", label: "자주 묻는 질문" },
    ],
  },
  {
    key: "board",
    icon: <CommentOutlined />,
    label: "게시판관리",
    children: [
      { key: "/board/free", label: "자유게시판" },
      { key: "/board/anonymous", label: "익명게시판" },
      { key: "/board/category", label: "카테고리관리" },
    ],
  },
  {
    key: "authorization",
    icon: <SafetyCertificateOutlined />,
    label: "보안관리",
    children: [
      { key: "/security/role/authorities", label: "회원권한" },
      { key: "/security/resource", label: "리소스" },
      { key: "/security/resource/token", label: "토큰" },
    ],
  },
  { key: "/me/settings", icon: <SettingOutlined />, label: "설정" },
];
