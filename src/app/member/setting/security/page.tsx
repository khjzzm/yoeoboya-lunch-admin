"use client";

import {Form, Input, Button, Card} from "antd";
import {useChangePassword} from "@/lib/api/useUser";
import {useAuthStore} from "@/store/useAuthStore";
import {ChangePasswordData} from "@/interfaces/auth";
import {useEffect} from "react";
import {handleApiError} from "@/lib/utils/handleApiError";


export default function SecuritySettingsPage() {
  const {user} = useAuthStore();
  const [form] = Form.useForm();
  const changePassword = useChangePassword();

  // useEffect(() => {
  //   if (errorMessage) {
  //     notification.error({
  //       message: "에러",
  //       description: errorMessage,
  //       placement: "topRight",
  //       duration: 3,
  //     });
  //   }
  // }, [errorMessage]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    }
  }, [user, form]);

  const onFinish = (values: ChangePasswordData) => {
    changePassword.mutate(values, {
      onError: (error) =>{
        handleApiError(error, true, form)
      }
    })
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-gray-100 py-12">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">🔐 보안 설정</h1>

      <Card className="w-full max-w-lg shadow-md p-6 bg-white">

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item name="loginId" label="아이디" rules={[{required: true, message: "아이디를 입력하세요!"}]}>
            <Input disabled/>
          </Form.Item>

          <Form.Item name="email" label="이메일" rules={[{required: true, message: "이메일을 입력하세요!"}]}>
            <Input disabled/>
          </Form.Item>

          <Form.Item name="oldPassword" label="현재 비밀번호" rules={[{required: true, message: "현재 비밀번호를 입력하세요!"}]}>
            <Input.Password/>
          </Form.Item>

          <Form.Item name="newPassword" label="새 비밀번호" rules={[{required: true, message: "새 비밀번호를 입력하세요!"}]}>
            <Input.Password/>
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
            <Input.Password/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={changePassword.isPending}>
              변경하기
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}