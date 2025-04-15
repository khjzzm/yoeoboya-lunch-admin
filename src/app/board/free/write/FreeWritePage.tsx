"use client";

import { Form, Input, Space, Typography } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BoardFormValues, FreeBoardCreate } from "@/types";

import CategorySelect from "@/components/board/CategorySelect";
import HashtagSelect from "@/components/board/HashtagSelect";
import SecretToggle from "@/components/board/SecretToggle";
import TiptapEditor from "@/components/board/TiptapEditor";
import Btn from "@/components/common/Btn";

import { useQueryParamNumber } from "@/lib/hooks/useQueryParam";
import {
  useCategories,
  useCreateFreeBoard,
  useFreeBoardDetail,
  useUpdateFreeBoard,
  useUploadFreeBoardFileToS3,
} from "@/lib/queries";
import { applyApiValidationErrors } from "@/lib/utils/apiErrorMessage";

const { Title } = Typography;

export default function FreeBoardWritePage() {
  const router = useRouter();
  const boardNo = useQueryParamNumber("boardNo");
  const editMode = Boolean(boardNo);

  const [form] = Form.useForm();
  const [content, setContent] = useState<string>("");

  const { data: detail } = useFreeBoardDetail(Number(boardNo));
  const { data: categories = [] } = useCategories("FREE");
  const { mutateAsync: uploadToS3 } = useUploadFreeBoardFileToS3();
  const createBoard = useCreateFreeBoard();
  const updateBoard = useUpdateFreeBoard(Number(boardNo));

  useEffect(() => {
    if (editMode && detail && categories.length > 0) {
      const data = detail;
      const matchedCategory = categories.find((c) => c.name === data.category);

      form.setFieldsValue({
        title: data.title,
        categoryId: matchedCategory?.id ?? null,
        hashTag: data.hashTag?.map((t) => t.tag),
        pin: data.pin,
        secret: data.secret,
      });
      setContent(data.content);
    }
  }, [editMode, form, detail, categories]);

  useEffect(() => {
    if (!editMode && categories.length > 0) {
      const currentValue = form.getFieldValue("categoryId");
      if (!currentValue) {
        form.setFieldValue("categoryId", categories[0].id);
      }
    }
  }, [editMode, categories, form]);

  const handleSubmit = (values: BoardFormValues) => {
    const payload: FreeBoardCreate = {
      ...values,
      content,
    };

    const mutation = editMode ? updateBoard : createBoard;
    mutation.mutate(payload, {
      onSuccess: () => {
        router.push("/board/free");
      },
      onError: (error) => {
        if (applyApiValidationErrors(error, form)) return;
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0">
      <Title level={3} className="text-center">
        {editMode ? "✏️ 게시글 수정" : "📝 자유게시판 글쓰기"}
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
        initialValues={{
          secret: false,
        }}
      >
        <Form.Item
          name="title"
          label="제목"
          rules={[{ required: true, message: "제목을 입력해주세요." }]}
        >
          <Input placeholder="제목을 입력하세요" maxLength={100} showCount allowClear />
        </Form.Item>

        <CategorySelect categories={categories} />

        <HashtagSelect />

        <SecretToggle form={form} />

        <TiptapEditor content={content} setContent={setContent} uploadToS3={uploadToS3} />

        <div className="flex justify-end mt-4">
          <Space>
            <Btn visual="outline" text="취소" onClick={() => router.push("/board/free")} />
            <Btn text={`${editMode ? "수정" : "등록"}`} htmlType={"submit"} />
          </Space>
        </div>
      </Form>
    </div>
  );
}
