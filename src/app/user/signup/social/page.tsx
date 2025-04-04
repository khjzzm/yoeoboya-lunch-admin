"use client";

import { Alert, Avatar, Button, Card, Form, Input, Typography } from "antd";
import { useEffect, useState } from "react";

import { SocialSignUpRequest } from "@/types";

import { useSocialSignUp } from "@/lib/queries/useLogin";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

const { Title, Text } = Typography;

export default function SocialSignUpPage() {
  const [form] = Form.useForm();
  const signUpMutation = useSocialSignUp();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [params, setParams] = useState<SocialSignUpRequest>({});

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    const parsed: SocialSignUpRequest = {
      loginId: query.get("loginId") || undefined,
      email: query.get("email") || undefined,
      name: query.get("name") || undefined,
      provider: query.get("provider") || undefined,
      profileImageUrl: query.get("picture") ? decodeURIComponent(query.get("picture")!) : undefined,
    };

    setParams(parsed);
    form.setFieldsValue(parsed);
  }, [form]);

  const handleSocialSignUp = (values: SocialSignUpRequest) => {
    signUpMutation.mutate(values, {
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
        const returnedError = apiErrorMessage(error, false);
        if (returnedError) setErrorMessage(returnedError);
      },
    });
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md shadow-lg p-8 rounded-lg bg-white">
        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <div className="flex flex-col items-center mb-4">
          {params.profileImageUrl ? (
            <Avatar size={80} src={params.profileImageUrl} />
          ) : (
            <Avatar size={80}>{params.name ? params.name.charAt(0) : "?"}</Avatar>
          )}
          <Title level={4} className="mt-2">
            소셜 회원가입
          </Title>
          {params.provider && (
            <Text type="secondary">({params.provider.toUpperCase()} 로그인)</Text>
          )}
        </div>

        <Form form={form} layout="vertical" onFinish={handleSocialSignUp}>
          <Form.Item label="아이디" name="loginId">
            <Input placeholder="아이디 입력" disabled value={params.loginId} />
          </Form.Item>

          <Form.Item
            label="이메일"
            name="email"
            rules={!params.email ? [{ required: true, message: "이메일을 입력해주세요!" }] : []}
          >
            <Input
              placeholder="이메일 입력"
              disabled={!!params.email}
              defaultValue={params.email || ""}
            />
          </Form.Item>

          <Form.Item label="이름" name="name">
            <Input placeholder="이름 입력" disabled value={params.name} />
          </Form.Item>

          <Form.Item name="provider" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item name="profileImageUrl" hidden>
            <Input type="hidden" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            className="w-full mt-4"
            loading={signUpMutation.isPending}
          >
            {signUpMutation.isPending ? "회원가입 중..." : "회원가입"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}
