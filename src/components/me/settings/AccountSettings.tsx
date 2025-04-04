"use client";

import { BankOutlined, CreditCardOutlined } from "@ant-design/icons";
import { Button, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";

import { useRegisterAccount, useUpdateAccount } from "@/lib/queries/useMe";

import { useAuthStore } from "@/store/useAuthStore";

const { Title } = Typography;

export default function AccountSettings() {
  const { user } = useAuthStore(); // 현재 사용자 정보
  const [form] = Form.useForm();
  const registerAccount = useRegisterAccount();
  const updateAccount = useUpdateAccount();
  const [isEditing, setIsEditing] = useState(false); // 수정 활성화 상태

  useEffect(() => {
    if (user?.account) {
      form.setFieldsValue(user.account);
    }
  }, [user, form]);

  const onFinish = (values: { bankName: string; accountNumber: string }) => {
    if (user?.account) {
      if (!isEditing) {
        setIsEditing(true);
        return;
      }
      updateAccount.mutate(values, {
        onSuccess: () => setIsEditing(false), // 수정 후 비활성화
      });
    } else {
      registerAccount.mutate(values);
    }
  };

  return (
    <div className="w-full bg-white p-12 rounded-lg shadow-md">
      <Title level={5} className="text-gray-800 mb-6">
        🏦 계좌 정보 {user?.account ? "수정" : "등록"}
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
        <Form.Item
          name="bankName"
          label="은행명"
          rules={[{ required: true, message: "은행명을 입력하세요!" }]}
        >
          <Input
            prefix={<BankOutlined />}
            placeholder="예: 국민은행"
            disabled={user?.account && !isEditing}
          />
        </Form.Item>

        <Form.Item
          name="accountNumber"
          label="계좌번호"
          rules={[{ required: true, message: "계좌번호를 입력하세요!" }]}
        >
          <Input
            prefix={<CreditCardOutlined />}
            placeholder="예: 123-4567-8901"
            disabled={user?.account && !isEditing}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={registerAccount.isPending || updateAccount.isPending}
          >
            {user?.account ? (isEditing ? "저장하기" : "수정하기") : "등록하기"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
