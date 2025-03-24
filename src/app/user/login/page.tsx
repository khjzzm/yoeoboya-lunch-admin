"use client";

import {useState} from "react";
import {useLogin} from "@/lib/api/useLogin";
import {useRouter} from "next/navigation";
import {Form, Input, Button, Card, Typography, Alert, Tooltip} from "antd";
import {
  FacebookFilled,
  GithubOutlined,
  GoogleOutlined,
  WindowsOutlined
} from "@ant-design/icons";
import {apiErrorMessage, applyApiValidationErrors} from "@/lib/utils/apiErrorMessage";

const {Title, Text} = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const login = useLogin();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (values: { loginId: string; password: string }) => {
    login.mutate(values, {
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
        const returnedError = apiErrorMessage(error, false);
        if (returnedError) setErrorMessage(returnedError);
      },
    });
  };

  /** 소셜 로그인 핸들러 (Spring Boot에서 OAuth 처리) */
  const handleSocialLogin = (provider: "google" | "kakao" | "naver" | "github" | "microsoft" | "facebook") => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl) {
      console.warn("❌ 환경변수(NEXT_PUBLIC_API_URL)가 설정되지 않았습니다.");
      return;
    }
    const authUrl = new URL(`/oauth2/authorization/${provider}`, backendUrl).toString();
    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-lg shadow-2xl p-10 rounded-xl bg-white">
        <Title level={3} className="text-center text-gray-900 mb-6">로그인</Title>

        {errorMessage && (
          <Alert message={errorMessage} type="error" showIcon className="mb-4"/>
        )}

        <Form form={form} layout="vertical" onFinish={handleLogin} className="space-y-4" requiredMark={false}>
          <Form.Item label="아이디" name="loginId" rules={[{required: true, message: "아이디를 입력하세요!"}]}>
            <Input size="large" placeholder="아이디 입력"/>
          </Form.Item>
          <Form.Item label="비밀번호" name="password" rules={[{required: true, message: "비밀번호를 입력하세요!"}]}>
            <Input.Password size="large" placeholder="비밀번호 입력"/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" className="w-full mt-2" loading={login.isPending}>
              {login.isPending ? "로그인 중..." : "로그인"}
            </Button>
          </Form.Item>
        </Form>

        {/* ✅ 소셜 로그인 영역 */}
        <div className="mt-6">
          <Text className="block text-center text-gray-500 mb-2">
            또는 소셜 계정으로 로그인
          </Text>

          {/* 소셜 버튼 영역 (고정 높이 + 아이콘 정렬) */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              size="large"
              className="flex items-center justify-center h-12 w-full"
              onClick={() => handleSocialLogin("google")}
            >
              <GoogleOutlined className="text-xl"/>
            </Button>

            <Button
              size="large"
              className="flex items-center justify-center h-12 w-full"
              style={{background: "#24292F", color: "#fff"}}
              onClick={() => handleSocialLogin("github")}
            >
              <GithubOutlined className="text-xl"/>
            </Button>

            <Tooltip title="준비 중입니다">
              <Button
                size="large"
                disabled
                className="flex items-center justify-center h-12 w-full opacity-50 cursor-not-allowed"
                style={{background: "#2F2F2F", color: "#fff"}}
                onClick={() => handleSocialLogin("microsoft")}
              >
                <WindowsOutlined className="text-xl"/>
              </Button>
            </Tooltip>

            <Button
              size="large"
              disabled
              className="flex items-center justify-center h-12 w-full opacity-50 cursor-not-allowed"
              style={{backgroundColor: "#03C75A", color: "#fff"}}
              onClick={() => handleSocialLogin("naver")}
            >
              <img src="/btnG_icon_circle.png" alt="Naver" className="w-9 h-9"/>
            </Button>

            <Button
              size="large"
              className="flex items-center justify-center h-12 w-full"
              style={{background: "#FEE500", color: "#000"}}
              onClick={() => handleSocialLogin("kakao")}
            >
              <img src="/logo_login-kakao.png" alt="Kakao" className="w-8 h-8"/>
            </Button>

            <Button
              size="large"
              disabled
              className="flex items-center justify-center h-12 w-full opacity-50 cursor-not-allowed"
              style={{background: "#1877F2", color: "#fff"}}
              onClick={() => handleSocialLogin("facebook")}
            >
              <FacebookFilled className="text-xl"/>
            </Button>
          </div>
        </div>

        {/* 회원가입 링크 */}
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Text type="secondary">계정이 없으신가요?</Text>
          <Button type="link" onClick={() => router.push("/user/signup")} className="font-medium">
            회원가입
          </Button>
        </div>
      </Card>
    </div>
  );
}