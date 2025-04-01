"use client";

import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import {useCreateNotice, useNoticeDetail, useUpdateNotice} from "@/lib/queries/useSupport";
import {Button, DatePicker, Form, Input, Select, Space, Switch} from "antd";
import {useEffect, useState} from "react";
import {applyApiValidationErrors} from "@/lib/utils/apiErrorMessage";
import {useAuthStore} from "@/store/useAuthStore";
import {NoticeFormValues, NoticeRequest} from "@/types";
import {useQueryParamNumber} from "@/lib/hooks/useQueryParam";
import dayjs from "dayjs";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), {ssr: false});

export default function NoticeWritePage() {
  const {user} = useAuthStore();
  const router = useRouter();
  const noticeId = useQueryParamNumber("noticeId");
  const editMode = Boolean(noticeId);

  const [form] = Form.useForm();
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    form.setFieldValue("author", user?.loginId || "");
  }, [form, user]);

  const {data: noticeDetail} = useNoticeDetail(Number(noticeId));
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice(Number(noticeId));

  useEffect(() => {
    if (editMode && noticeDetail?.data) {
      const data = noticeDetail.data;

      form.setFieldsValue({
        title: data.title,
        category: data.category,
        author: data.author,
        pinned: data.pinned,
        status: data.status,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
      });

      setContent(data.content);
    }
  }, [editMode, form, noticeDetail]);

  const handleSubmit = (values: NoticeFormValues) => {
    const payload: NoticeRequest = {
      ...values,
      content,
      startDate: values.startDate ? dayjs(values.startDate).format("YYYY-MM-DDTHH:mm:ss") : null,
      endDate: values.endDate ? dayjs(values.endDate).format("YYYY-MM-DDTHH:mm:ss") : null,
    };

    const mutation = editMode ? updateNotice : createNotice;
    mutation.mutate(payload, {
      onSuccess: () => router.push("/support/notice"),
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
      },
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6"> {editMode ? "✏️ 공지사항 수정" : "📌 공지사항 작성"}</h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{
        category: "일반",
        pinned: false,
        status: "ACTIVE",
        author: user?.loginId,
      }}>
        <Form.Item name="title" label="제목" rules={[{required: true, message: "제목을 입력하세요!"}]}>
          <Input placeholder="제목을 입력하세요"/>
        </Form.Item>

        <Form.Item name="category" label="카테고리" rules={[{required: true, message: "카테고리를 선택하세요!"}]}>
          <Select
            placeholder="카테고리를 선택하세요"
            options={[
              {label: "일반", value: "일반"},
              {label: "점검", value: "점검"},
              {label: "행사", value: "행사"},
              {label: "일반", value: "일반"},
              {label: "시스템", value: "시스템"},
            ]}
          />
        </Form.Item>

        <Form.Item name="author" label="작성자" hidden rules={[{required: true}]}>
          <Input disabled/>
        </Form.Item>
        <Form.Item name="pinned" label="상단 고정" valuePropName="checked">
          <Switch checkedChildren="고정" unCheckedChildren="기본"/>
        </Form.Item>
        <Form.Item name="status" label="상태" rules={[{required: true, message: "상태를 선택하세요!"}]}>
          <Select
            placeholder="상태를 선택하세요"
            options={[
              {label: "활성", value: "ACTIVE"},
              {label: "비활성", value: "INACTIVE"},
            ]}
          />
        </Form.Item>

        <Form.Item label="공지 기간">
          <Space size="middle">
            <Form.Item name="startDate" noStyle>
              <DatePicker placeholder="시작일"/>
            </Form.Item>
            <Form.Item name="endDate" noStyle>
              <DatePicker placeholder="종료일"/>
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item name="content" label="본문">
          <TiptapEditor content={content} setContent={setContent}/>
        </Form.Item>

        <Button htmlType="submit" type="primary">
          {editMode ? "수정 완료" : "작성 완료"}
        </Button>
      </Form>
    </div>
  );
}