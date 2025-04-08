"use client";

import { Table, Button, Modal, Form, Input, Select, Popconfirm } from "antd";
import { useEffect, useMemo, useState } from "react";

import { BoardType, CategoryResponse, CategoryCreateRequest, CategoryEditRequest } from "@/types";

import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
  useBoardTypes,
} from "@/lib/queries";

export default function AdminCategoryPage() {
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
  const [selectedBoardType, setSelectedBoardType] = useState<BoardType>("FREE");

  const { data: boardTypeList, isLoading: boardTypeLoading } = useBoardTypes();
  const { data: categories = [], refetch } = useCategories(selectedBoardType);

  const create = useCreateCategory(refetch);
  const update = useUpdateCategory(refetch);
  const remove = useDeleteCategory(refetch);

  const boardTypeOptions = useMemo(
    () =>
      boardTypeList?.data.map((type) => ({
        label: type.name,
        value: type.code,
      })) ?? [],
    [boardTypeList],
  );

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
      create.mutate({ ...values, boardType: selectedBoardType } as CategoryCreateRequest);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <Select
          value={selectedBoardType}
          onChange={(value) => setSelectedBoardType(value)}
          options={boardTypeOptions}
          loading={boardTypeLoading}
          style={{ minWidth: 200 }}
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
          {
            title: <div style={{ textAlign: "center" }}>카테고리 이름</div>,
            dataIndex: "name",
            width: 180,
            ellipsis: true, // 긴 텍스트는 ... 처리
          },
          {
            title: <div style={{ textAlign: "center" }}>설명</div>,
            dataIndex: "description",
            width: 350,
            ellipsis: true,
          },
          {
            title: <div style={{ textAlign: "center" }}>작업</div>,
            width: 160,
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
