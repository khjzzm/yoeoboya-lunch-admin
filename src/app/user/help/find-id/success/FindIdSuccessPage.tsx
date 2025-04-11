"use client";

import { CheckCircleFilled } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { useRouter } from "next/navigation";

import { useQueryParamString } from "@/lib/hooks/useQueryParam";

const { Title, Text } = Typography;

export default function FindIdSuccessPage() {
  const loginId = useQueryParamString("loginId");
  const router = useRouter();

  if (!loginId) {
    return <div className="text-center text-red-500 mt-20">아이디를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-100 px-4 sm:px-6">
      <Card className="w-full max-w-md p-8 shadow-lg rounded-xl bg-white text-center">
        <CheckCircleFilled className="text-green-500 text-5xl mb-4" />

        <Title level={4} className="mb-2">
          회원님의 아이디를 찾았습니다!
        </Title>

        <Text type="secondary" className="block mb-6">
          아이디: <strong>{loginId}</strong>
        </Text>

        <Button type="primary" size="large" onClick={() => router.push("/user/login")}>
          로그인하러 가기
        </Button>
      </Card>
    </div>
  );
}
