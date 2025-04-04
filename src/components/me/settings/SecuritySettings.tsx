"use client";

import { KeyOutlined, LockOutlined } from "@ant-design/icons";
import { Alert, Button, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";

import { ChangePasswordRequest } from "@/types";

import { useChangePassword } from "@/lib/queries/useLogin";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

import { useAuthStore } from "@/store/useAuthStore";

const { Title } = Typography;

export default function SecuritySettings() {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const changePassword = useChangePassword();
  const [errorMessage, setErrorMessage] = useState<string | null>(null); //  전체 에러 메시지 상태 추가

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const onFinish = (values: ChangePasswordRequest) => {
    changePassword.mutate(values, {
      onSuccess: () => {
        setErrorMessage(null);
      },
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) {
          setErrorMessage(null);
          return;
        }
        const returnedError = apiErrorMessage(error, false);
        if (returnedError) {
          setErrorMessage(returnedError);
        }
      },
    });
  };

  return (
    <div className="w-full bg-white p-12 rounded-lg shadow-md">
      <Title level={5} className="text-gray-800 mb-6">
        🔐 비밀번호 및 인증
      </Title>

      {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
        <div className="grid grid-cols-2 gap-6 hidden">
          <Form.Item name="loginId" label="아이디" className="col-span-1">
            <Input disabled />
          </Form.Item>

          <Form.Item name="email" label="이메일" className="col-span-1">
            <Input disabled />
          </Form.Item>
        </div>

        <Form.Item
          name="oldPassword"
          label="현재 비밀번호"
          rules={[{ required: true, message: "현재 비밀번호를 입력하세요!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="현재 비밀번호" />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="새 비밀번호"
          rules={[{ required: true, message: "새 비밀번호를 입력하세요!" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="새 비밀번호" />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label="새 비밀번호 확인"
          dependencies={["newPassword"]}
          validateTrigger="onBlur"
          rules={[
            { required: true, message: "새 비밀번호를 다시 입력하세요!" },
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
          <Input.Password prefix={<KeyOutlined />} placeholder="새 비밀번호 확인" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={changePassword.isPending}>
            비밀번호 변경하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
