"use client";

import { LogoutOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Dropdown, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLogout } from "@/lib/queries/useLogin";

import { useAuthStore } from "@/store/useAuthStore";

const { Text } = Typography;

export default function ProfileDropdown() {
  const router = useRouter();
  const { user } = useAuthStore();
  const logoutMutation = useLogout();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logoutMutation.mutate();
    setOpen(false);
  };

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      placement="bottomRight"
      trigger={["click"]}
      dropdownRender={() => (
        <Card className="w-72 sm:w-80 p-4 sm:p-6 rounded-lg shadow-lg">
          {/* 프로필 이미지 및 정보 */}
          <div className="flex flex-col items-center">
            <Avatar
              size={64}
              src={user?.profileImages?.find((img) => img.isDefault)?.imageUrl || ""}
              className="mb-2"
            />
            <Text className="text-base sm:text-lg font-semibold">{user?.name}</Text>
            <Text type="secondary" className="text-xs sm:text-sm">
              {user?.email}
            </Text>
          </div>

          {/* 계정 관리 버튼 */}
          <Button
            type="default"
            block
            size="middle"
            className="mt-4 text-sm sm:text-base"
            onClick={() => router.push("/me/settings")}
          >
            계정 관리
          </Button>

          {/* 계정 추가 & 로그아웃 버튼 */}
          <div className="mt-4 flex justify-between">
            <Button type="text" size="small" icon={<PlusCircleOutlined />} className="text-sm">
              서비스 이동
            </Button>
            <Button
              type="text"
              size="small"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="text-sm"
            >
              로그아웃
            </Button>
          </div>

          {/* 하단 개인정보 처리방침 */}
          <div className="mt-4 text-[10px] sm:text-xs text-center text-gray-500">
            <span className="cursor-pointer">개인정보처리방침</span> •{" "}
            <span className="cursor-pointer">서비스 약관</span>
          </div>
        </Card>
      )}
    >
      <div className="cursor-pointer flex items-center space-x-2">
        <Avatar
          size={40}
          src={user?.profileImages?.find((img) => img.isDefault)?.imageUrl || null}
          className="border-2 border-gray-300"
        />
      </div>
    </Dropdown>
  );
}
