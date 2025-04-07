"use client";

import { Button, DatePicker, Form, Input, Select, Space, Switch } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { NoticeFormValues, NoticeCreate } from "@/types";

import TiptapEditor from "@/components/board/TiptapEditor";

import { useQueryParamNumber } from "@/lib/hooks/useQueryParam";
import {
  useCreateNotice,
  useNoticeDetail,
  useUpdateNotice,
  useUploadNoticeFileToS3,
} from "@/lib/queries/support/useNotice";
import { useCategories } from "@/lib/queries/useBoardHooks";
import { applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

import { useAuthStore } from "@/store/useAuthStore";

export default function NoticeWritePage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const boardNo = useQueryParamNumber("boardNo");
  const editMode = Boolean(boardNo);

  const [form] = Form.useForm();
  const [content, setContent] = useState<string>("");
  useEffect(() => {
    form.setFieldValue("author", user?.loginId || "");
  }, [form, user]);

  const { data: noticeDetail } = useNoticeDetail(Number(boardNo));
  const { data: categories = [] } = useCategories("NOTICE");
  const { mutateAsync: uploadToS3 } = useUploadNoticeFileToS3();
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice(Number(boardNo));

  useEffect(() => {
    if (editMode && noticeDetail?.data && categories.length > 0) {
      const data = noticeDetail.data;
      const matchedCategory = categories.find((c) => c.name === data.category);

      form.setFieldsValue({
        title: data.title,
        categoryId: matchedCategory?.id,
        author: data.author,
        pinned: data.pinned,
        status: data.status,
        startDate: data.startDate ? dayjs(data.startDate) : null,
        endDate: data.endDate ? dayjs(data.endDate) : null,
      });

      setContent(data.content);
    }
  }, [editMode, form, noticeDetail, categories]);

  const handleSubmit = (values: NoticeFormValues) => {
    const payload: NoticeCreate = {
      ...values,
      content,
      categoryId: values.categoryId,
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
      <h1 className="text-2xl font-bold mb-6">
        {" "}
        {editMode ? "✏️ 공지사항 수정" : "📌 공지사항 작성"}
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          pinned: false,
          status: "ACTIVE",
          author: user?.loginId,
        }}
      >
        <Form.Item
          name="title"
          label="제목"
          rules={[{ required: true, message: "제목을 입력하세요!" }]}
        >
          <Input placeholder="제목을 입력하세요" />
        </Form.Item>

        <Form.Item
          name="categoryId"
          label="카테고리"
          rules={[{ required: true, message: "카테고리를 선택하세요!" }]}
        >
          <Select
            placeholder="카테고리를 선택하세요"
            options={categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }))}
          />
        </Form.Item>

        <Form.Item name="author" label="작성자" hidden rules={[{ required: true }]}>
          <Input disabled />
        </Form.Item>
        <Form.Item name="pinned" label="상단 고정" valuePropName="checked">
          <Switch checkedChildren="고정" unCheckedChildren="기본" />
        </Form.Item>
        <Form.Item
          name="status"
          label="상태"
          rules={[{ required: true, message: "상태를 선택하세요!" }]}
        >
          <Select
            placeholder="상태를 선택하세요"
            options={[
              { label: "활성", value: "ACTIVE" },
              { label: "비활성", value: "INACTIVE" },
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

        <Form.Item name="content" label="본문" className="!w-full" style={{ width: "100%" }}>
          <TiptapEditor content={content} setContent={setContent} uploadToS3={uploadToS3} />
        </Form.Item>

        <Button htmlType="submit" type="primary">
          {editMode ? "수정 완료" : "작성 완료"}
        </Button>
      </Form>
    </div>
  );
}
