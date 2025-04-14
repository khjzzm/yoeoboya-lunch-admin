import { UserOutlined, LockOutlined, BankOutlined } from "@ant-design/icons";
import { ReactNode } from "react";

import AccountSettings from "@/components/me/settings/AccountSettings";
import ProfileSettings from "@/components/me/settings/ProfileSettings";
import SecuritySettings from "@/components/me/settings/SecuritySettings";

export type SectionItem = {
  key: string;
  label: string;
  icon?: ReactNode;
  component: ReactNode | null;
  disabled?: boolean;
};

export const getSections = (provider: string | undefined): SectionItem[] => [
  {
    key: "profile",
    label: "프로필",
    icon: <UserOutlined />,
    component: <ProfileSettings />,
  },
  {
    key: "security",
    label: "비밀번호 및 인증",
    icon: <LockOutlined />,
    component: provider === "yeoboya" ? <SecuritySettings /> : null,
    disabled: provider !== "yeoboya",
  },
  {
    key: "account",
    label: "계좌등록",
    icon: <BankOutlined />,
    component: <AccountSettings />,
  },
];
