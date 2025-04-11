"use client";

import { Button, Card, Form, Input, Typography, Alert } from "antd";
import { useState } from "react";

import { WithdrawRequest } from "@/types";

import { useWithdraw } from "@/lib/queries";

const { Title } = Typography;

export default function WithdrawForm() {
  const [form] = Form.useForm();
  const withdrawMutation = useWithdraw();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFinish = (values: WithdrawRequest) => {
    withdrawMutation.mutate(values, {
      onError: () => {
        setErrorMessage("회원 탈퇴에 실패했습니다. 정보를 다시 확인해주세요.");
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-dvh bg-gray-100 px-4 sm:px-6">
      <Card className="w-full max-w-md p-6 shadow-2xl rounded-xl bg-white">
        <Title level={4} className="text-center text-gray-900 mb-6">
          회원 탈퇴
        </Title>

        {errorMessage && <Alert message={errorMessage} type="error" showIcon className="mb-4" />}

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          requiredMark={false}
          validateTrigger="onBlur"
          initialValues={{ provider: "yeoboya" }}
        >
          <Form.Item
            label="아이디"
            name="loginId"
            rules={[{ required: true, message: "아이디를 입력하세요." }]}
          >
            <Input placeholder="아이디 입력" />
          </Form.Item>

          <Form.Item
            label="이메일"
            name="email"
            rules={[{ required: true, message: "이메일을 입력하세요.", type: "email" }]}
          >
            <Input placeholder="이메일 입력" />
          </Form.Item>

          <Form.Item label="탈퇴 사유" name="reason">
            <Input.TextArea placeholder="(선택) 탈퇴 사유를 입력해주세요." rows={3} />
          </Form.Item>

          <Form.Item name="provider" hidden>
            <Input />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={withdrawMutation.isPending}>
            탈퇴하기
          </Button>
        </Form>
      </Card>
    </div>
  );
}
