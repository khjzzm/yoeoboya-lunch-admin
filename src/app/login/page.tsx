"use client";

import { useLogin } from "@/lib/api/useLogin";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title, Text } = Typography;

export default function LoginPage() {
  const loginMutation = useLogin();
  const router = useRouter();

  const handleLogin = (values: { loginId: string; password: string }) => {
    loginMutation.mutate(values);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 로그인 카드 영역 */}
      <div className="flex flex-grow items-center justify-center">
        <Card className="w-full max-w-md shadow-xl p-8 rounded-lg bg-white">
          <Title level={4} className="text-center text-gray-800">
            로그인
          </Title>

          <Form layout="vertical" onFinish={handleLogin} className="mt-4">
            <Form.Item label="아이디" name="loginId" rules={[{ required: true, message: "아이디를 입력하세요!" }]}>
              <Input size="large" placeholder="아이디 입력" />
            </Form.Item>

            <Form.Item label="비밀번호" name="password" rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}>
              <Input.Password size="large" placeholder="비밀번호 입력" />
            </Form.Item>

            <Form.Item className="mt-6">
              <Button type="primary" htmlType="submit" size="large" className="w-full" loading={loginMutation.isPending}>
                {loginMutation.isPending ? "로그인 중..." : "로그인"}
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Text type="secondary">계정이 없으신가요?</Text>
            <Button type="link" onClick={() => router.push("/signup")} className="ml-2">
              회원가입
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}