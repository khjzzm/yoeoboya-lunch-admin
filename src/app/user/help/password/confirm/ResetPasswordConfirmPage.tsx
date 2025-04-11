"use client";

import { Button, Card, Form, Input, Result, Typography } from "antd";
import React from "react";

import YeoboyaLogo from "@/components/common/YeoboyaLogo";

import { useQueryParamString } from "@/lib/hooks/useQueryParam";
import { useResetPassword } from "@/lib/queries";

const { Title } = Typography;
export default function ResetPasswordConfirmPage() {
  const loginId = useQueryParamString("login_id");
  const email = useQueryParamString("email");
  const passKey = useQueryParamString("pass_key");

  const { mutate } = useResetPassword();

  const [form] = Form.useForm();

  if (!email || !passKey || !loginId) {
    return <Result status="error" title="잘못된 접근입니다." />;
  }

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-100 px-4 sm:px-6">
      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-10 shadow-2xl rounded-xl bg-white">
        <YeoboyaLogo size="xl" className="hover:opacity-70 transition" />
        <Title level={4} className="text-center">
          비밀번호 재설정
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={mutate}
          className="space-y-4"
          requiredMark={false}
        >
          <Form.Item label="아이디" name="loginId" hidden initialValue={loginId}>
            <Input readOnly disabled />
          </Form.Item>
          <Form.Item label="이메일" name="email" hidden initialValue={email}>
            <Input readOnly disabled />
          </Form.Item>
          <Form.Item label="패스키" name="passKey" hidden initialValue={passKey}>
            <Input readOnly disabled />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="새 비밀번호"
            rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
          >
            <Input.Password placeholder="새 비밀번호" />
          </Form.Item>
          <Form.Item
            name="confirmNewPassword"
            label="새 비밀번호 확인"
            dependencies={["newPassword"]}
            rules={[
              { required: true, message: "비밀번호 확인을 입력하세요." },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
                },
              }),
            ]}
          >
            <Input.Password placeholder="비밀번호 확인" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            비밀번호 재설정
          </Button>
        </Form>
      </Card>
    </div>
  );
}
