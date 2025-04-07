"use client";

import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { useEffect, useState } from "react";

import { BoardType, CategoryResponse, CategoryCreateRequest, CategoryEditRequest } from "@/types";

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/lib/queries";

export default function AdminCategoryPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [boardType, setBoardType] = useState<BoardType>("FREE");

  const { data: categories = [], refetch } = useCategories(boardType);
  const create = useCreateCategory(refetch);
  const update = useUpdateCategory(refetch);
  const remove = useDeleteCategory(refetch);

  useEffect(() => {
    if (editingCategory) {
      form.setFieldsValue(editingCategory);
    } else {
      form.resetFields();
    }
  }, [editingCategory, form, modalOpen]);

  const handleSubmit = (values: CategoryCreateRequest | CategoryEditRequest) => {
    if (editingCategory) {
      update.mutate({ id: editingCategory.id, ...values } as CategoryEditRequest);
    } else {
      create.mutate({ ...values, boardType } as CategoryCreateRequest);
    }
    setModalOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">카테고리 관리</h1>

      <div className="flex justify-between mb-4">
        <Select
          value={boardType}
          onChange={setBoardType}
          options={[
            { label: "자유게시판", value: "FREE" },
            { label: "공지사항", value: "NOTICE" },
          ]}
        />
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true);
            setEditingCategory(null);
          }}
        >
          카테고리 추가
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={categories}
        columns={[
          { title: "이름", dataIndex: "name" },
          { title: "설명", dataIndex: "description" },
          {
            title: "작업",
            render: (_, record) => (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    setModalOpen(true);
                    setEditingCategory(record);
                  }}
                >
                  수정
                </Button>
                <Popconfirm
                  title="정말 삭제하시겠습니까?"
                  onConfirm={() => remove.mutate(record.id)}
                >
                  <Button size="small" danger className="ml-2">
                    삭제
                  </Button>
                </Popconfirm>
              </>
            ),
          },
        ]}
      />

      <Modal
        title={editingCategory ? "카테고리 수정" : "카테고리 추가"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="이름" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="설명">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
