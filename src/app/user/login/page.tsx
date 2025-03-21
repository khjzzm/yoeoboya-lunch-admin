"use client";

import {useState} from "react";
import {useUser} from "@/lib/api/useUser";
import {useRouter} from "next/navigation";
import {Form, Input, Button, Card, Typography, Alert} from "antd";
import {apiErrorMessage, applyApiValidationErrors} from "@/lib/utils/apiErrorMessage";

const {Title, Text} = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const loginMutation = useUser();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); //  전체 에러 메시지 상태 추가

  const handleLogin = (values: { loginId: string; password: string }) => {
    loginMutation.mutate(values, {
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
        const returnedError = apiErrorMessage(error, false);
        if (returnedError) setErrorMessage(returnedError);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg shadow-2xl p-10 rounded-xl bg-white">
        <Title level={3} className="text-center text-gray-900 mb-6">
          로그인
        </Title>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          className="space-y-4"
        >
          <Form.Item
            label={<Text className="font-medium text-gray-700">아이디</Text>}
            name="loginId"
            rules={[{required: true, message: "아이디를 입력하세요!"}]}
          >
            <Input size="large" placeholder="아이디 입력"/>
          </Form.Item>

          <Form.Item
            label={<Text className="font-medium text-gray-700">비밀번호</Text>}
            name="password"
            rules={[{required: true, message: "비밀번호를 입력하세요!"}]}
          >
            <Input.Password size="large" placeholder="비밀번호 입력"/>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full mt-2"
              loading={loginMutation.isPending}
            >
              {loginMutation.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </Form.Item>
        </Form>

        <div className="flex justify-center items-center mt-6 space-x-2">
          <Text type="secondary">계정이 없으신가요?</Text>
          <Button
            type="link"
            onClick={() => router.push("/user/signup")}
            className="font-medium"
          >
            회원가입
          </Button>
        </div>
      </Card>
    </div>
  );
}
