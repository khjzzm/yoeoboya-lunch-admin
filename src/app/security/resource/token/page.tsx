"use client";

import {useDeleteTokenIgnoreUrl, useFetchTokenIgnoreUrls, useUpdateTokenIgnoreUrl,} from "@/lib/queries/useResources";
import {Button, Form, Input, Modal, Space, Switch, Table, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import {apiErrorMessage} from "@/lib/utils/apiErrorMessage";

// TokenIgnoreUrl 인터페이스
interface TokenIgnoreUrl {
  id: number;
  url: string;
  isIgnore: boolean;
}

export default function TokenIgnoreUrlsPage() {
  const { data, isLoading, error } = useFetchTokenIgnoreUrls();
  const updateTokenIgnoreUrl = useUpdateTokenIgnoreUrl();
  const deleteTokenIgnoreUrl = useDeleteTokenIgnoreUrl();

  const [selectedRecord, setSelectedRecord] = useState<TokenIgnoreUrl | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [switchState, setSwitchState] = useState(form.getFieldValue("isIgnore") || false);

  useEffect(() => {
    setSwitchState(form.getFieldValue("isIgnore") || false);
  }, [form]);

  const handleSwitchChange = (checked: boolean) => {
    setSwitchState(checked);
    form.setFieldsValue({ isIgnore: checked });
  };

  const showModal = (record?: TokenIgnoreUrl) => {
    setSelectedRecord(record || { id: 0, url: "", isIgnore: false });
    form.setFieldsValue(record || { url: "", isIgnore: false });
    setIsModalOpen(true);
  };

  const handleCancel = () => setIsModalOpen(false);

  const showDeleteModal = (record: TokenIgnoreUrl) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedRecord) {
      deleteTokenIgnoreUrl.mutate(selectedRecord.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
        onError: (error) => {
          apiErrorMessage(error);
        },
      });
    }
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      updateTokenIgnoreUrl.mutate(values, {
        onError: (error) => {
          apiErrorMessage(error);
        },
        onSettled: () => {
          setIsModalOpen(false);
        },
      });
    });
  };

  const tokenIgnoreUrls = Array.isArray(data) ? data : [];

  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>ID</div>,
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: <div style={{ textAlign: "center" }}>URL</div>,
      dataIndex: "url",
      key: "url",
      width: 300,
    },
    {
      title: <div style={{ textAlign: "center" }}>토큰 무시 여부</div>,
      dataIndex: "isIgnore",
      key: "isIgnore",
      width: 150,
      render: (isIgnore: boolean) => (isIgnore ? "🔓토큰 무시" : "🔒토큰 필요"),
    },
    {
      title: <div style={{ textAlign: "center" }}>액션</div>,
      key: "action",
      width: 100,
      render: (_: unknown, record: TokenIgnoreUrl) => (
        <Space>
          <Button onClick={() => showModal(record)} type="text" icon={<EditOutlined />} />
          <Button onClick={() => showDeleteModal(record)} type="text" icon={<DeleteOutlined />} danger />
        </Space>
      ),
    },
  ];

  if (error) return <p>데이터를 불러오는 중 오류 발생 🚨</p>;

  return (
    <div>
      {/* 제목 */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🔑 토큰 무시 URL 관리</h1>
        <Tooltip title="추가">
          <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => showModal()} />
        </Tooltip>
      </div>

      {/* ✅ 반응형 테이블 wrapper */}
      <div className="overflow-x-auto">
        <Table
          dataSource={tokenIgnoreUrls}
          columns={columns}
          rowKey="id"
          bordered
          loading={isLoading}
          scroll={{ x: "max-content" }}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* 추가 및 수정 모달 */}
      <Modal title="🔧 토큰 무시 URL 설정" open={isModalOpen} onCancel={handleCancel} onOk={handleSave}>
        <Form form={form} layout="vertical">
          <Form.Item name="url" label="URL" rules={[{ required: true, message: "URL을 입력하세요!" }]}>
            <Input placeholder="/test" />
          </Form.Item>

          <Form.Item name="isIgnore" label="토큰 인증 설정" valuePropName="checked">
            <Switch
              checked={switchState}
              onChange={handleSwitchChange}
              checkedChildren="토큰 인증 제외"
              unCheckedChildren="토큰 인증 사용"
              style={{
                backgroundColor: switchState ? "#f5222d" : "#52c41a",
              }}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 삭제 확인 모달 */}
      <Modal
        title="⚠️ 삭제 확인"
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onOk={handleDeleteConfirm}
        okButtonProps={{ danger: true }}
      >
        <p>
          정말로 <strong>{selectedRecord?.url}</strong>을(를) 삭제하시겠습니까?
        </p>
      </Modal>
    </div>
  );
}