"use client";

import { Button, Form, Input, Result } from "antd";
import React from "react";

import { useQueryParamString } from "@/lib/hooks/useQueryParam";
import { useResetPassword } from "@/lib/queries";

export default function ResetPasswordConfirmPage() {
  const email = useQueryParamString("email");
  const passKey = useQueryParamString("pass_key");
  const { mutate } = useResetPassword(email, passKey);

  const [form] = Form.useForm();

  // if (!email || !passKey) {
  //   return <Result status="error" title="잘못된 접근입니다." />;
  // }

  return (
    <div className="max-w-md mx-auto mt-20 p-4 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">비밀번호 재설정</h2>
      <Form form={form} layout="vertical" onFinish={mutate} requiredMark={false}>
        <Form.Item
          name="loginId"
          label="아이디"
          rules={[{ required: true, message: "아이디를 입력하세요." }]}
        >
          <Input.Password placeholder="새 비밀번호" />
        </Form.Item>
        <Form.Item
          name="email"
          label="이메일"
          rules={[{ required: true, message: "이메일를 입력하세요." }]}
        >
          <Input.Password placeholder="새 비밀번호" />
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
    </div>
  );
}
