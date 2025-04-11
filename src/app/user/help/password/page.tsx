"use client";

import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Typography } from "antd";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import { SignUpRequest } from "@/types";

import YeoboyaLogo from "@/components/common/YeoboyaLogo";

import { useSendResetPasswordMail } from "@/lib/queries";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

const { Title } = Typography;
export default function ResetPasswordRequestPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutate: sendPasswordEmail, isPending } = useSendResetPasswordMail();

  const handleSignUp = (values: SignUpRequest) => {
    sendPasswordEmail(values, {
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
        const returnedError = apiErrorMessage(error, false);
        if (returnedError) setErrorMessage(returnedError);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-100 px-4 sm:px-6">
      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-10 shadow-2xl rounded-xl bg-white">
        <YeoboyaLogo size="xl" containerClassName="mb-6 mt-2" />
        <Title level={4} className="text-center">
          비밀번호 찾기
        </Title>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignUp}
          requiredMark={false}
          validateTrigger="onBlur"
        >
          <Form.Item
            name="loginId"
            label="가입한 아이디"
            rules={[{ required: true, message: "아이디를 입력하세요!" }]}
          >
            <Input
              size="large"
              placeholder="아이디"
              prefix={<UserOutlined />}
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="가입한 이메일"
            rules={[{ required: true, type: "email", message: "이메일을 입력하세요!" }]}
          >
            <Input
              size="large"
              placeholder="이메일 주소"
              prefix={<MailOutlined />}
              className="rounded-md"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            className="border-none text-white font-bold mt-2 h-12"
            loading={isPending}
          >
            이메일 전송
          </Button>
        </Form>

        <div className="mt-6 text-sm text-gray-500  text-center">
          아이디가 기억나지 않는다면?{" "}
          <Button type="link" className="px-1" onClick={() => router.push("/user/help/find-id")}>
            아이디 찾기
          </Button>
        </div>
      </Card>
    </div>
  );
}
