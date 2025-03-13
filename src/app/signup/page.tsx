"use client";

import { useState } from "react";
import { useSignUp } from "@/lib/api/useLogin";
import { Form, Input, Button, Card, Typography } from "antd";

const { Title } = Typography;

export default function SignUpPage() {
  const [form] = Form.useForm();
  const signUpMutation = useSignUp();

  const handleSignUp = (values: { loginId: string; email: string; name: string; password: string }) => {
    signUpMutation.mutate(values, {
      onError: (error: any) => {
        if (error?.response?.data?.validation) {
          const errors = error.response.data.validation.map((err: { field: string; message: string }) => ({
            name: err.field,
            errors: [err.message],
          }));
          form.setFields(errors);
        }
      },
    });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg p-8">
        <Title level={4} className="text-center">회원가입</Title>

        <Form form={form} layout="vertical" onFinish={handleSignUp}>
          <Form.Item label="아이디" name="loginId" rules={[{ required: true, message: "아이디를 입력하세요!" }]}>
            <Input placeholder="아이디 입력" />
          </Form.Item>

          <Form.Item label="이메일" name="email" rules={[{ required: true, message: "이메일을 입력하세요!" }]}>
            <Input placeholder="이메일 입력" />
          </Form.Item>

          <Form.Item label="이름" name="name" rules={[{ required: true, message: "이름을 입력하세요!" }]}>
            <Input placeholder="이름 입력" />
          </Form.Item>

          <Form.Item label="비밀번호" name="password" rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}>
            <Input.Password placeholder="비밀번호 입력" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full" loading={signUpMutation.isPending}>
            {signUpMutation.isPending ? "회원가입 중..." : "회원가입"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}