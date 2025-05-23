"use client";

import { Alert, Button, Card, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";

import { SignUpRequest } from "@/types";

import YeoboyaLogo from "@/components/common/YeoboyaLogo";

import { useRandomKoreanName } from "@/lib/hooks/useRandomKoreanName";
import { useSignUp } from "@/lib/queries";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

const { Title } = Typography;

export default function SignUpPage() {
  const [form] = Form.useForm();
  const signUpMutation = useSignUp();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const nickName = useRandomKoreanName();

  useEffect(() => {
    if (nickName) {
      form.setFieldsValue({ nickName });
    }
  }, [nickName, form]);

  const handleSignUp = (values: SignUpRequest) => {
    signUpMutation.mutate(values, {
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
        <Title level={3} className="text-center text-gray-900 mb-6 text-lg sm:text-xl md:text-2xl">
          회원가입
        </Title>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSignUp}
          className="space-y-8"
          requiredMark={false}
        >
          <Form.Item
            label="아이디"
            name="loginId"
            rules={[{ required: true, message: "아이디를 입력하세요!" }]}
          >
            <Input size="large" placeholder="아이디 입력" />
          </Form.Item>

          <Form.Item
            label="이메일"
            name="email"
            rules={[{ required: true, message: "이메일을 입력하세요!" }]}
          >
            <Input size="large" placeholder="이메일 입력" />
          </Form.Item>

          <Form.Item
            label="이름"
            name="name"
            rules={[{ required: true, message: "이름을 입력하세요!" }]}
          >
            <Input size="large" placeholder="이름 입력" />
          </Form.Item>

          <Form.Item
            label="비밀번호"
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}
          >
            <Input.Password size="large" placeholder="비밀번호 입력" />
          </Form.Item>

          <Form.Item name="nickName" hidden>
            <Input readOnly value={nickName} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="w-full h-12 sm:h-14"
            loading={signUpMutation.isPending}
          >
            {signUpMutation.isPending ? "회원가입 중..." : "회원가입"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
