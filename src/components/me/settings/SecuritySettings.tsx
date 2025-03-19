"use client";

import {Form, Input, Button, Typography} from "antd";
import {useChangePassword} from "@/lib/api/useUser";
import {useAuthStore} from "@/store/useAuthStore";
import {ChangePasswordData} from "@/interfaces/auth";
import {useEffect} from "react";
import {handleApiError} from "@/lib/utils/handleApiError";
import {KeyOutlined, LockOutlined} from "@ant-design/icons";

const {Title} = Typography;

export default function SecuritySettings() {
  const {user} = useAuthStore();
  const [form] = Form.useForm();
  const changePassword = useChangePassword();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const onFinish = (values: ChangePasswordData) => {
    changePassword.mutate(values, {
      onError: (error) => {
        handleApiError(error, true, form);
      },
    });
  };

  return (
    <div className="w-full bg-white p-12 rounded-lg shadow-md">
      <Title level={5} className="text-gray-800 mb-6">🔐 비밀번호 및 인증</Title>

      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
        <div className="grid grid-cols-2 gap-6 hidden">
          <Form.Item name="loginId" label="아이디" className="col-span-1">
            <Input disabled/>
          </Form.Item>

          <Form.Item name="email" label="이메일" className="col-span-1">
            <Input disabled/>
          </Form.Item>
        </div>

        <Form.Item
          name="oldPassword"
          label="현재 비밀번호"
          rules={[{required: true, message: "현재 비밀번호를 입력하세요!"}]}
        >
          <Input.Password prefix={<LockOutlined/>} placeholder="현재 비밀번호"/>
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="새 비밀번호"
          rules={[{required: true, message: "새 비밀번호를 입력하세요!"}]}
        >
          <Input.Password prefix={<LockOutlined/>} placeholder="새 비밀번호"/>
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label="새 비밀번호 확인"
          dependencies={["newPassword"]}
          validateTrigger="onBlur"
          rules={[
            {required: true, message: "새 비밀번호를 다시 입력하세요!"},
            ({getFieldValue}) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("비밀번호가 일치하지 않습니다."));
              },
            }),
          ]}
        >
          <Input.Password prefix={<KeyOutlined/>} placeholder="새 비밀번호 확인"/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={changePassword.isPending}>
            비밀번호 변경하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}