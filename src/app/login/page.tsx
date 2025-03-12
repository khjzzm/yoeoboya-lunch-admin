"use client";

import { useLogin } from "@/lib/api/useLogin";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title } = Typography;

export default function LoginPage() {
  const loginMutation = useLogin();

  const handleLogin = (values: { loginId: string; password: string }) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* 상단 네이비 배경 */}
      <div className="h-28 bg-gradient-to-r from-[#10166A] to-[#00021A] w-full"></div>

      {/* 로그인 카드 영역 */}
      <div className="flex flex-grow items-center justify-center bg-gray-100">
        <Card className="w-full max-w-md shadow-lg p-8">
          <Title level={4} className="text-center">
            여보야 관리자 로그인
          </Title>

          <Form layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label="아이디"
              name="loginId"
              rules={[{ required: true, message: "아이디를 입력하세요!" }]}
            >
              <Input placeholder="아이디 입력" />
            </Form.Item>

            <Form.Item
              label="비밀번호"
              name="password"
              rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}
            >
              <Input.Password placeholder="비밀번호 입력" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={loginMutation.isPending}
              >
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}