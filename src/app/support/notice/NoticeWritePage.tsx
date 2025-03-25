"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateNotice, useUpdateNotice, useNoticeDetail } from "@/lib/api/useSupport";
import { Input, Select, DatePicker, Button, Form, Space } from "antd";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import type { NoticeRequest } from "@/types/support";
import {applyApiValidationErrors} from "@/lib/utils/apiErrorMessage";

const TiptapEditor = dynamic(() => import("@/components/TiptapEditor"), { ssr: false });

export default function NoticeWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const noticeId = searchParams.get("id");
  const editMode = Boolean(noticeId);

  const [form] = Form.useForm();
  const [content, setContent] = useState<string>("");

  const { data: noticeDetail } = useNoticeDetail(Number(noticeId));
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice(Number(noticeId));

  useEffect(() => {
    if (editMode && noticeDetail) {
      form.setFieldsValue({
        ...noticeDetail,
        startDate: noticeDetail.startDate ? dayjs(noticeDetail.startDate) : null,
        endDate: noticeDetail.endDate ? dayjs(noticeDetail.endDate) : null,
      });
      setContent(noticeDetail.content);
    }
  }, [noticeDetail]);

  const handleSubmit = (values: NoticeRequest) => {
    const payload: NoticeRequest = {
      ...values,
      content,
      startDate: values.startDate?.toString(),
      endDate: values.endDate?.toString(),
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
      <h1 className="text-2xl font-bold mb-6">
        {editMode ? "✏️ 공지사항 수정" : "📌 공지사항 작성"}
      </h1>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="title" label="제목" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="category" label="카테고리" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="author" label="작성자" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="priority" label="우선순위">
          <Select
            options={[
              { label: "낮음", value: "LOW" },
              { label: "보통", value: "NORMAL" }, // 🔄 백엔드 Enum과 일치시킴
              { label: "높음", value: "HIGH" },
            ]}
          />
        </Form.Item>

        <Form.Item name="status" label="상태">
          <Select
            options={[
              { label: "활성", value: "ACTIVE" },
              { label: "비활성", value: "INACTIVE" },
              { label: "삭제됨", value: "DELETED" },
            ]}
          />
        </Form.Item>

        <Form.Item label="공지 기간">
          <Space size="middle">
            <Form.Item name="startDate" noStyle>
              <DatePicker placeholder="시작일" />
            </Form.Item>
            <Form.Item name="endDate" noStyle>
              <DatePicker placeholder="종료일" />
            </Form.Item>
          </Space>
        </Form.Item>

        <Form.Item label="본문">
          <TiptapEditor content={content} setContent={setContent} />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          {editMode ? "수정 완료" : "작성 완료"}
        </Button>
      </Form>
    </div>
  );
}