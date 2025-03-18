"use client";

import {Form, Input, Button, Upload, Avatar, Typography, Modal} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { User } from "@/interfaces/auth";

const { Title } = Typography;

export default function ProfileSettings() {
  const { user } = useAuthStore();
  const [form] = Form.useForm();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
      const defaultImage = user.profileImages?.find((img) => img.isDefault);
      setSelectedImage(defaultImage?.imageUrl || user.profileImages?.[0]?.imageUrl || null);
    }
  }, [user, form]);

  const onFinish = (values: Partial<User>) => {
    console.log("수정된 정보:", values);
  };

  /** 프로필 이미지 클릭 시 확대 */
  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full bg-white p-12 rounded-lg shadow-md">
      <Title level={2} className="text-gray-800 mb-6">👤 프로필</Title>

      {/* 프로필 이미지 */}
      <div className="flex items-center space-x-6 mb-6">
        <div className="flex flex-col items-center">
          {selectedImage ? (
            <Avatar
              size={120}
              src={selectedImage}
              className="border-4 border-blue-500 cursor-pointer"
              onClick={() => handleImageClick(selectedImage)}
            />
          ) : (
            <Avatar size={120} className="border-4 border-gray-300">?</Avatar>
          )}
        </div>

        {/* 썸네일 목록 */}
        <div className="flex space-x-2">
          {user?.profileImages?.map((image, index) => (
            <Avatar
              key={index}
              size={60}
              src={image.thumbnailUrl}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedImage === image.imageUrl ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => handleImageClick(image.imageUrl)}
            />
          ))}
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
        <div className="grid grid-cols-2 gap-6">
          <Form.Item name="loginId" label="아이디" className="col-span-1">
            <Input disabled />
          </Form.Item>

          <Form.Item name="email" label="이메일" className="col-span-1">
            <Input disabled />
          </Form.Item>

          <Form.Item name={["info", "nickName"]} label="닉네임" className="col-span-1">
            <Input />
          </Form.Item>

          <Form.Item name={["info", "phoneNumber"]} label="전화번호" className="col-span-1">
            <Input />
          </Form.Item>
        </div>

        <Form.Item name={["info", "bio"]} label="소개">
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* 계좌 정보 */}
        <div className="grid grid-cols-2 gap-6">
          <Form.Item name={["account", "bankName"]} label="은행명" className="col-span-1">
            <Input disabled />
          </Form.Item>

          <Form.Item name={["account", "accountNumber"]} label="계좌번호" className="col-span-1">
            <Input disabled />
          </Form.Item>
        </div>

        {/* 프로필 이미지 업로드 */}
        <Form.Item label="프로필 사진 변경">
          <Upload showUploadList={false}>
            <Button icon={<UploadOutlined />}>이미지 업로드</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            정보 수정하기
          </Button>
        </Form.Item>
      </Form>

      {/* 프로필 사진 확대 모달 */}
      <Modal
        open={isModalOpen}
        footer={null}
        onCancel={() => setIsModalOpen(false)}
        centered
      >
        <img src={selectedImage || ""} alt="확대된 프로필 이미지" className="w-full rounded-lg"/>
      </Modal>
    </div>
  );
}