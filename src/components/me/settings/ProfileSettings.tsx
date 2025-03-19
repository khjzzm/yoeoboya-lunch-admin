"use client";

import {Form, Input, Button, Upload, Avatar, Typography, Modal} from "antd";
import {StarOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {useAuthStore} from "@/store/useAuthStore";
import {useEffect, useState} from "react";
import {User} from "@/interfaces/auth";
import {useSetDefaultProfileImage, useUploadProfileImage, useUpdateMyInfo} from "@/lib/api/useMe";
import Image from "next/image";
import {handleApiError} from "@/lib/utils/handleApiError"; // ✅ next/image 사용

const {Title} = Typography;

export default function ProfileSettings() {
  const {user} = useAuthStore();
  const [form] = Form.useForm();
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(null); // 대표 이미지 (실제 변경될 값)
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 모달에서 표시할 이미지
  const [selectedImageId, setSelectedImageId] = useState<number | null>(null); // 선택된 이미지 ID
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const setDefaultProfileImage = useSetDefaultProfileImage(); // 대표사진 등록 API 호출
  const uploadProfileImage = useUploadProfileImage(); //사진 업로드
  const updateMyInfo = useUpdateMyInfo();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
      const defaultImage = user.profileImages?.find((img) => img.isDefault);
      setCurrentProfileImage(defaultImage?.imageUrl || user.profileImages?.[0]?.imageUrl || null);
    }
  }, [user, form]);

  const onFinish = (values: { info?: { bio?: string; nickName?: string; phoneNumber?: string } }) => {
    const updateData: { bio?: string; nickName?: string; phoneNumber?: string } = {};

    if (values.info?.bio !== undefined) updateData.bio = values.info.bio;
    if (values.info?.nickName !== undefined) updateData.nickName = values.info.nickName;
    if (values.info?.phoneNumber !== undefined) updateData.phoneNumber = values.info.phoneNumber;

    updateMyInfo.mutate(updateData, {
      onError: (error) => {
        handleApiError(error, true, form);
      },
    })
  };

  const handleImageUpload = ({ file }: { file: File }) => {
    uploadProfileImage.mutate(file);
  };

  /** 썸네일 클릭 시 모달만 열기 (대표 사진 변경 X) */
  const handleImageClick = (imageUrl: string, profileImageNo: number) => {
    setSelectedImage(imageUrl);
    setSelectedImageId(profileImageNo);
    setIsModalOpen(true);
  };

  /** 대표사진 등록 */
  const handleSetAsDefault = () => {
    if (!selectedImageId) return;

    setDefaultProfileImage.mutate(selectedImageId, {
        onSuccess: () => {
          setCurrentProfileImage(selectedImage);
          setSelectedImageId(null)
          setIsModalOpen(false);
        },
      }
    );
  };

  return (
    <div className="w-full bg-white p-12 rounded-lg shadow-md">
      <Title level={5} className="text-gray-800 mb-6">👤 프로필</Title>

      {/* 프로필 이미지 및 업로드 버튼 */}
      <div className="relative flex items-center space-x-6 mb-6">
        {/* 현재 대표 프로필 사진 */}
        <div className="relative">
          <Avatar
            size={120}
            src={currentProfileImage}
            className="border-4 border-blue-500"
          />

          {/* 프로필 이미지 변경 버튼 (우측 하단 동그라미 버튼) */}
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleImageUpload({ file: file as File }); // ✅ 직접 함수 호출
              return false; // ✅ 기본 업로드 이벤트를 막음 (중복 요청 방지)
            }}
          >
            <Button
              shape="circle"
              icon={<PlusCircleOutlined />}
              className="absolute bottom-0 right-0 bg-white shadow-md"
            />
          </Upload>
        </div>

        {/* 썸네일 목록 */}
        <div className="flex space-x-2">
          {user?.profileImages?.map((image, index) => (
            <Avatar
              key={index}
              size={60}
              src={image.thumbnailUrl}
              className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                selectedImageId === image.profileImageNo ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => handleImageClick(image.imageUrl, image.profileImageNo)}
            />
          ))}
        </div>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish} className="w-full">
        <div className="grid grid-cols-2 gap-6">
          <Form.Item name="loginId" label="아이디" className="col-span-1">
            <Input disabled/>
          </Form.Item>

          <Form.Item name="email" label="이메일" className="col-span-1">
            <Input disabled/>
          </Form.Item>

          <Form.Item name={["info", "nickName"]} label="닉네임" className="col-span-1">
            <Input disabled/>
          </Form.Item>

          <Form.Item name={["info", "phoneNumber"]} label="전화번호" className="col-span-1">
            <Input/>
          </Form.Item>
        </div>

        <Form.Item name={["info", "bio"]} label="소개">
          <Input.TextArea rows={3}/>
        </Form.Item>

        {/* 계좌 정보 */}
        <div className="grid grid-cols-2 gap-6">
          <Form.Item name={["account", "bankName"]} label="은행명" className="col-span-1">
            <Input disabled/>
          </Form.Item>

          <Form.Item name={["account", "accountNumber"]} label="계좌번호" className="col-span-1">
            <Input disabled/>
          </Form.Item>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            정보 수정하기
          </Button>
        </Form.Item>
      </Form>

      {/* 프로필 사진 확대 모달 */}
      <Modal
        open={isModalOpen}
        footer={[
          <Button
            key="set-default"
            type="primary"
            icon={<StarOutlined />}
            onClick={handleSetAsDefault}
            disabled={!selectedImageId}
          >
            대표사진 등록
          </Button>,
        ]}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedImageId(null);
        }}
        centered
      >
        {selectedImage && (
          <div className="w-full h-[300px]">
            <Image
              src={selectedImage}
              alt="확대된 프로필 이미지"
              layout="fill"
              objectFit="contain"
              className="rounded-lg"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}