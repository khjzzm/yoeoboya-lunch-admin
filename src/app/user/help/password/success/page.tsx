// /app/user/reset/password/success/page.tsx
"use client";

import { CheckCircleTwoTone } from "@ant-design/icons";
import { Button, Card, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

export default function ResetPasswordSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-100 px-4">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-xl bg-white text-center">
        <CheckCircleTwoTone twoToneColor="#52c41a" style={{ fontSize: 48 }} />
        <Title level={3} className="mt-4">
          메일 전송 완료
        </Title>
        <Paragraph className="text-gray-600">
          입력하신 이메일 주소로 비밀번호 재설정 링크를 보냈습니다.
        </Paragraph>
        <Button type="primary" onClick={() => router.push("/user/login")} className="mt-4" block>
          로그인 화면으로 이동
        </Button>
      </Card>
    </div>
  );
}
