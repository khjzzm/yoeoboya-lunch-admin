"use client";
import { FacebookFilled, GithubOutlined, GoogleOutlined, WindowsOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Form, Input, Tooltip, Typography } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { SocialProvider } from "@/types";

import { useQueryParamString } from "@/lib/hooks/useQueryParam";
import { useLogin } from "@/lib/queries";
import { apiErrorMessage, applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

const { Title, Text } = Typography;
export default function LoginPage() {
  const [form] = Form.useForm();
  const login = useLogin();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messageFromSocial = useQueryParamString("message");
  useEffect(() => {
    if (messageFromSocial) {
      setErrorMessage(decodeURIComponent(messageFromSocial));
    }
  }, [messageFromSocial]);

  const handleLogin = (values: { loginId: string; password: string }) => {
    login.mutate(values, {
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
        const returnedError = apiErrorMessage(error, false);
        if (returnedError) setErrorMessage(returnedError);
      },
    });
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    const API_URL =
      typeof window !== "undefined"
        ? window.__ENV?.NEXT_PUBLIC_API_URL
        : process.env.NEXT_PUBLIC_API_URL;
    if (!API_URL) {
      console.warn("❌ 환경변수(NEXT_PUBLIC_API_URL)가 설정되지 않았습니다.");
      return;
    }
    window.location.href = new URL(`/oauth2/authorization/${provider}`, API_URL).toString();
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-100 px-4 sm:px-6">
      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-10 shadow-2xl rounded-xl bg-white">
        <Title level={3} className="text-center text-gray-900 mb-6 text-lg sm:text-xl md:text-2xl">
          로그인
        </Title>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleLogin}
          className="space-y-4"
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
            label="비밀번호"
            name="password"
            rules={[{ required: true, message: "비밀번호를 입력하세요!" }]}
          >
            <Input.Password size="large" placeholder="비밀번호 입력" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full h-12 sm:h-14"
              loading={login.isPending}
            >
              {login.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </Form.Item>
        </Form>

        {/* 소셜 로그인 */}
        <div className="mt-6">
          <Text className="block text-center text-gray-500 mb-2">또는 소셜 계정으로 로그인</Text>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Button
              size="large"
              className="flex items-center justify-center h-12 sm:h-14 w-full"
              onClick={() => handleSocialLogin("google")}
            >
              <GoogleOutlined className="text-xl" />
            </Button>

            <Button
              size="large"
              className="flex items-center justify-center h-12 sm:h-14 w-full"
              style={{ background: "#24292F", color: "#fff" }}
              onClick={() => handleSocialLogin("github")}
            >
              <GithubOutlined className="text-xl" />
            </Button>

            <Tooltip title="준비 중입니다">
              <Button
                size="large"
                disabled
                className="flex items-center justify-center h-12 sm:h-14 w-full opacity-50 cursor-not-allowed"
                style={{ background: "#2F2F2F", color: "#fff" }}
              >
                <WindowsOutlined className="text-xl" />
              </Button>
            </Tooltip>

            <Button
              size="large"
              className="flex items-center justify-center h-12 sm:h-14 w-full"
              style={{ backgroundColor: "#03C75A", color: "#fff" }}
              onClick={() => handleSocialLogin("naver")}
            >
              <Image
                src="/social/naver.png"
                alt="Naver"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </Button>

            <Button
              size="large"
              className="flex items-center justify-center h-12 sm:h-14 w-full"
              style={{ background: "#FEE500", color: "#000" }}
              onClick={() => handleSocialLogin("kakao")}
            >
              <Image
                src="/social/kakao.png"
                alt="Naver"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </Button>

            <Button
              size="large"
              className="flex items-center justify-center h-12 sm:h-14 w-full"
              style={{ background: "#1877F2", color: "#fff" }}
              onClick={() => handleSocialLogin("facebook")}
            >
              <FacebookFilled className="text-xl" />
            </Button>
          </div>
        </div>

        <div className="flex justify-center items-center mt-6 space-x-4 text-sm">
          <Button
            type="link"
            style={{ color: "#4B5563" }}
            className="px-1"
            onClick={() => router.push("/user/find-id")}
          >
            아이디 찾기
          </Button>
          <span>|</span>
          <Button
            type="link"
            style={{ color: "#4B5563" }}
            className="px-1"
            onClick={() => router.push("/user/reset/password")}
          >
            비밀번호 찾기
          </Button>
          <span>|</span>
          <Button type="link" className="px-1" onClick={() => router.push("/user/signup")}>
            회원가입
          </Button>
        </div>
      </Card>
    </div>
  );
}
