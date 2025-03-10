"use client";

import {
  useFetchTokenIgnoreUrls,
  useUpdateTokenIgnoreUrl,
  useDeleteTokenIgnoreUrl, //삭제 훅 추가
} from "@/lib/api/useFetchResources";
import { Table, Spin, Button, Input, Switch, Form, Modal, message } from "antd";
import { useState } from "react";

//TokenIgnoreUrl 인터페이스
interface TokenIgnoreUrl {
  id: number;
  url: string;
  isIgnore: boolean;
}

export default function TokenIgnoreUrlsPage() {
  const { data, isLoading, error } = useFetchTokenIgnoreUrls();
  const updateTokenIgnoreUrl = useUpdateTokenIgnoreUrl();
  const deleteTokenIgnoreUrl = useDeleteTokenIgnoreUrl(); //삭제 훅 사용

  const [selectedRecord, setSelectedRecord] = useState<TokenIgnoreUrl | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //삭제 확인 모달 상태 추가
  const [form] = Form.useForm();

  //모달 열기 (현재 상태 반영)
  const showModal = (record?: TokenIgnoreUrl) => {
    setSelectedRecord(record || { id: 0, url: "", isIgnore: false }); // 기본값 유지
    form.setFieldsValue(record || { url: "", isIgnore: false }); // 초기 값 설정
    setIsModalOpen(true);
  };

  //모달 닫기
  const handleCancel = () => setIsModalOpen(false);

  //삭제 모달 열기
  const showDeleteModal = (record: TokenIgnoreUrl) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  //삭제 취소
  const handleDeleteCancel = () => setIsDeleteModalOpen(false);

  //삭제 확인 및 실행
  const handleDeleteConfirm = () => {
    if (selectedRecord) {
      deleteTokenIgnoreUrl.mutate(selectedRecord.id, {
        onSuccess: () => {
          message.success("✅ 삭제 완료!");
          setIsDeleteModalOpen(false);
        },
        onError: () => {
          message.error("🚨 삭제 중 오류 발생!");
        },
      });
    }
  };

  //저장 (추가 또는 수정)
  const handleSave = () => {
    form.validateFields().then((values) => {
      updateTokenIgnoreUrl.mutate(values);
      setIsModalOpen(false);
    });
  };

  //데이터가 undefined일 경우 대비하여 기본값 설정
  const tokenIgnoreUrls = Array.isArray(data) ? data : [];

  //테이블 컬럼 정의
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "URL", dataIndex: "url", key: "url" },
    {
      title: "토큰 무시 여부",
      dataIndex: "isIgnore",
      key: "isIgnore",
      render: (isIgnore: boolean) => (isIgnore ? "🔓토큰 무시" : "🔒토큰 필요"),
    },
    {
      title: "액션",
      key: "action",
      render: (_: unknown, record: TokenIgnoreUrl) => (
        <>
          <Button onClick={() => showModal(record)} style={{ marginRight: 8 }}>✏️ 수정</Button>
          <Button onClick={() => showDeleteModal(record)} danger>🗑️ 삭제</Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-lg font-semibold">🔑 토큰 무시 URL 목록</h1>

      <Button type="primary" onClick={() => showModal()} style={{ marginBottom: 16 }}>
        ➕ 새 URL 추가
      </Button>

      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : error ? (
        <p style={{ color: "red" }}>🚨 데이터를 불러오는 중 오류 발생</p>
      ) : (
        <Table dataSource={tokenIgnoreUrls} columns={columns} rowKey="id" />
      )}

      {/*추가 및 수정 모달 */}
      <Modal title="🔧 토큰 무시 URL 설정" open={isModalOpen} onCancel={handleCancel} onOk={handleSave}>
        <Form form={form} layout="vertical">
          <Form.Item name="url" label="URL" rules={[{ required: true, message: "URL을 입력하세요!" }]}>
            <Input placeholder="/test" />
          </Form.Item>
          <Form.Item name="isIgnore" label="토큰 무시 여부" valuePropName="checked">
            <Switch checkedChildren="무시" unCheckedChildren="토큰 필요" />
          </Form.Item>
        </Form>
      </Modal>

      {/*삭제 확인 모달 */}
      <Modal
        title="⚠️ 삭제 확인"
        open={isDeleteModalOpen}
        onCancel={handleDeleteCancel}
        onOk={handleDeleteConfirm}
        okButtonProps={{ danger: true }}
      >
        <p>정말로 <strong>{selectedRecord?.url}</strong>을(를) 삭제하시겠습니까?</p>
      </Modal>
    </div>
  );
}