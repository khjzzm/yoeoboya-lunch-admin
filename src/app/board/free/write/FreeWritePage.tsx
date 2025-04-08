"use client";

import { Button, Form, Input, Select, Space, Typography, InputNumber, Switch } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { BoardFormValues, FreeBoardCreate } from "@/types";

import CategorySelect from "@/components/board/CategorySelect";
import TiptapEditor from "@/components/board/TiptapEditor";

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

  const { data: boardDetail } = useFreeBoardDetail(Number(boardNo));
  const { data: categories = [] } = useCategories("FREE");
  const { mutateAsync: uploadToS3 } = useUploadFreeBoardFileToS3();
  const createBoard = useCreateFreeBoard();
  const updateBoard = useUpdateFreeBoard(Number(boardNo));

  useEffect(() => {
    if (editMode && boardDetail?.data && categories.length > 0) {
      const data = boardDetail.data;
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
  }, [editMode, form, boardDetail, categories]);

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
    <div>
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

        <Form.Item
          name="hashTag"
          label="해시태그 (최대 10개, 콤마로 구분)"
          tooltip="예: 일상, 개발, 여행"
        >
          <Select
            mode="tags"
            tokenSeparators={[","]}
            placeholder="해시태그를 입력하세요"
            maxTagCount={10}
          />
        </Form.Item>

        <Form.Item
          name="pin"
          label="게시글 비밀번호 (숫자 4자리)"
          tooltip="게시글에 비밀번호를 설정할 수 있어요"
          rules={[
            { type: "number", min: 0, max: 9999, message: "0부터 9999 사이의 숫자를 입력하세요." },
          ]}
        >
          <InputNumber placeholder="예: 1234" maxLength={4} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="secret" label="비밀글 여부" valuePropName="checked">
          <Switch checkedChildren="비밀글" unCheckedChildren="공개글" />
        </Form.Item>

        <Form.Item name="content" label="본문">
          <TiptapEditor content={content} setContent={setContent} uploadToS3={uploadToS3} />
        </Form.Item>

        <div className="flex justify-end mt-4">
          <Space>
            <Button onClick={() => router.push("/board/free")}>취소</Button>
            <Button type="primary" htmlType="submit">
              {editMode ? "수정" : "등록"}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
}
