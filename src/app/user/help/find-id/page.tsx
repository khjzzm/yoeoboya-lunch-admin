"use client";

import { Alert, Button, Card, Form, Input, Typography } from "antd";
import React, { useState } from "react";

import YeoboyaLogo from "@/components/common/YeoboyaLogo";

import { useFindLoginId } from "@/lib/queries";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

const { Title } = Typography;

export default function FindIdPage() {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: findLoginId, isPending } = useFindLoginId();

  const handleSubmit = (values: { email: string }) => {
    findLoginId(values, {
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
        const message = apiErrorMessage(error, false);
        if (message) setErrorMessage(message);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-100 px-4 sm:px-6">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-xl bg-white">
        <YeoboyaLogo size="xl" containerClassName="mb-6 mt-2" />
        <Title level={4} className="text-center">
          아이디 찾기
        </Title>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark={false}
          className="space-y-4"
          validateTrigger="onBlur"
        >
          <Form.Item
            name="email"
            label="가입한 이메일"
            rules={[{ required: true, message: "이메일을 입력하세요.", type: "email" }]}
          >
            <Input placeholder="user@example.com" size="large" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block size="large" loading={isPending}>
            아이디 찾기
          </Button>
        </Form>
      </Card>
    </div>
  );
}
