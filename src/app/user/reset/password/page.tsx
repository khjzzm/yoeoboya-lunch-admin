"use client";

import { MailOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input } from "antd";
import { router } from "next/client";
import { useState } from "react";

import { SignUpRequest } from "@/types";

import { useSendResetPasswordMail } from "@/lib/queries";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

export default function ResetPasswordRequestPage() {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const passwordMutation = useSendResetPasswordMail(() => form.resetFields());

  const handleSignUp = (values: SignUpRequest) => {
    passwordMutation.mutate(values, {
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
        <h3 className="text-3xl font-extrabold mb-4  text-center">Yeoboya-lunch</h3>
        <h4 className="text-base sm:text-lg font-semibold mb-6 text-gray-800 text-center">
          비밀번호를 찾고자하는 아이디를 입력해주세요.
        </h4>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignUp}
          requiredMark={false}
          validateTrigger="onBlur"
        >
          <Form.Item name="loginId" rules={[{ required: true, message: "아이디를 입력하세요!" }]}>
            <Input
              size="large"
              placeholder="아이디 또는 이메일"
              prefix={<UserOutlined />}
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="email"
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
            loading={passwordMutation.isPending}
          >
            이메일 전송
          </Button>
        </Form>

        <div className="mt-6 text-sm text-gray-500  text-center">
          아이디가 기억나지 않는다면?{" "}
          <span
            onClick={() => router.push("/user/find-id")}
            className="hover:underline cursor-pointer"
          >
            아이디 찾기
          </span>
        </div>
      </Card>
    </div>
  );
}
