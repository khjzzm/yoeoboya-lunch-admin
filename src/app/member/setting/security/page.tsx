"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useChangePassword } from "@/lib/api/useUser";

export default function SecuritySettingsPage() {
  const [form] = Form.useForm();
  const changePassword = useChangePassword(); // ✅ isLoading 제거

  // 🔥 폼 제출 시 실행
  // 🔥 폼 제출 시 실행
  const onFinish = (values: {old}) => {
    changePassword.mutate(values, {
      onError: (error: unknown) => {
        if (typeof error === "object" && error !== null && "response" in error) {
          const axiosError = error as { response?: { data?: { validation?: { field: string; message: string }[] } } };

          if (axiosError?.response?.data?.validation) {
            const errors = axiosError.response.data.validation.map((err) => ({
              name: err.field as string,
              errors: [err.message as string],
            }));
            form.setFields(errors);
          }
        }
      },
    });
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🔐 보안 설정</h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="w-full max-w-lg bg-white p-6 shadow-md rounded-lg"
      >
        {/* 🔑 현재 비밀번호 */}
        <Form.Item
          label="현재 비밀번호"
          name="oldPassword"
          rules={[{ required: true, message: "현재 비밀번호를 입력해주세요." }]}
        >
          <Input.Password placeholder="현재 비밀번호" />
        </Form.Item>

        {/* 🔑 새 비밀번호 */}
        <Form.Item
          label="새 비밀번호"
          name="newPassword"
          rules={[
            { required: true, message: "새 비밀번호를 입력해주세요." },
            { min: 8, message: "비밀번호는 최소 8자 이상이어야 합니다." },
          ]}
        >
          <Input.Password placeholder="새 비밀번호" />
        </Form.Item>

        {/* 🔑 새 비밀번호 확인 */}
        <Form.Item
          label="새 비밀번호 확인"
          name="confirmNewPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "새 비밀번호를 다시 입력해주세요." },
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
          <Input.Password placeholder="새 비밀번호 확인" />
        </Form.Item>

        {/* 🔥 변경 버튼 */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            비밀번호 변경
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
