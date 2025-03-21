"use client";

import {useState} from "react";
import {Avatar, Button, Dropdown, Typography, Card} from "antd";
import {LogoutOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {useAuthStore} from "@/store/useAuthStore";
import {useLogout} from "@/lib/api/useLogin";
import {useRouter} from "next/navigation";

const {Text} = Typography;

export default function ProfileDropdown() {
  const router = useRouter();
  const {user} = useAuthStore();
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
        <Card className="w-80 p-4 rounded-lg shadow-lg">
          {/* 프로필 이미지 및 정보 */}
          <div className="flex flex-col items-center">
            <Avatar size={80} src={user?.profileImages?.find((img) => img.isDefault)?.imageUrl || ""}/>
            <Text className="mt-2 text-lg font-semibold">{user?.name}</Text>
            <Text type="secondary">{user?.email}</Text>
          </div>

          {/* 계정 관리 버튼 */}
          <Button type="default" block className="mt-4" onClick={() => router.push("/me/settings")}>
            계정 관리
          </Button>

          {/* 계정 추가 & 로그아웃 버튼 */}
          <div className="mt-4 flex justify-between">
            <Button type="text" icon={<PlusCircleOutlined/>}>서비스 이동</Button>
            <Button type="text" danger icon={<LogoutOutlined/>} onClick={handleLogout}>
              로그아웃
            </Button>
          </div>

          {/* 하단 개인정보 처리방침 */}
          <div className="mt-4 text-xs text-center text-gray-500">
            <span className="cursor-pointer">개인정보처리방침</span> • <span className="cursor-pointer">서비스 약관</span>
          </div>
        </Card>
      )}
    >
      <div className="cursor-pointer flex items-center space-x-2">
        <Avatar
          size={40}
          src={
            user?.profileImages?.find((img) => img.isDefault)?.imageUrl || null
          }
          className="border-2 border-gray-300"
        />
        {/*<Text className="text-white">{user?.name || user?.loginId}</Text>*/}
      </div>
    </Dropdown>
  );
}