"use client";

import {
  useFetchTokenIgnoreUrls,
  useUpdateTokenIgnoreUrl,
  useDeleteTokenIgnoreUrl,
} from "@/lib/api/useResources";
import {Table, Spin, Button, Input, Switch, Form, Modal, message, Space, Tooltip} from "antd";
import {useEffect, useState} from "react";
import {EditOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";

// TokenIgnoreUrl 인터페이스
interface TokenIgnoreUrl {
  id: number;
  url: string;
  isIgnore: boolean;
}

export default function TokenIgnoreUrlsPage() {
  const {data, isLoading, error} = useFetchTokenIgnoreUrls();
  const updateTokenIgnoreUrl = useUpdateTokenIgnoreUrl();
  const deleteTokenIgnoreUrl = useDeleteTokenIgnoreUrl();

  const [selectedRecord, setSelectedRecord] = useState<TokenIgnoreUrl | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [form] = Form.useForm();

  // 초기 상태를 Form 값에서 가져오기
  const [switchState, setSwitchState] = useState(form.getFieldValue("isIgnore") || false);

  // Form의 값이 변경될 때 상태 동기화
  useEffect(() => {
    setSwitchState(form.getFieldValue("isIgnore") || false);
  }, [form]);

  // Switch 변경 시 상태 업데이트 + Form 값 반영
  const handleSwitchChange = (checked: boolean) => {
    setSwitchState(checked); // 상태 변경
    form.setFieldsValue({ isIgnore: checked }); // Form에도 값 반영
  };


  // 모달 열기
  const showModal = (record?: TokenIgnoreUrl) => {
    setSelectedRecord(record || {id: 0, url: "", isIgnore: false});
    form.setFieldsValue(record || {url: "", isIgnore: false});
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCancel = () => setIsModalOpen(false);

  // 삭제 모달 열기
  const showDeleteModal = (record: TokenIgnoreUrl) => {
    setSelectedRecord(record);
    setIsDeleteModalOpen(true);
  };

  // 삭제 확인
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

  // 저장
  const handleSave = () => {
    form.validateFields().then((values) => {
      updateTokenIgnoreUrl.mutate(values);
      setIsModalOpen(false);
    });
  };

  // 데이터 준비
  const tokenIgnoreUrls = Array.isArray(data) ? data : [];

  // 테이블 컬럼 정의
  const columns = [
    {
      title: <div style={{textAlign: "center"}}>ID</div>,
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: <div style={{textAlign: "center"}}>URL</div>,
      dataIndex: "url",
      key: "url",
      width: 300,
    },
    {
      title: <div style={{textAlign: "center"}}>토큰 무시 여부</div>,
      dataIndex: "isIgnore",
      key: "isIgnore",
      width: 150,
      render: (isIgnore: boolean) => (isIgnore ? "🔓토큰 무시" : "🔒토큰 필요"),
    },
    {
      title: <div style={{textAlign: "center"}}>액션</div>,
      key: "action",
      width: 100,
      render: (_: unknown, record: TokenIgnoreUrl) => (
        <Space>
          <Button onClick={() => showModal(record)} type="text" icon={<EditOutlined/>}/>
          <Button onClick={() => showDeleteModal(record)} type="text" icon={<DeleteOutlined/>} danger/>
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* 제목 */}
      <div className="flex justify-between items-center border-b pb-2 mb-4">
        <h1 className="text-2xl font-bold text-gray-800">🔑 토큰 무시 URL 관리</h1>
        <Tooltip title="추가">
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          />
        </Tooltip>
      </div>

      {/* 테이블 */}
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spin size="large"/>
        </div>
      ) : error ? (
        <p className="text-red-500">🚨 데이터를 불러오는 중 오류 발생</p>
      ) : (
        <Table
          dataSource={tokenIgnoreUrls || []}
          columns={columns}
          rowKey="id"
          bordered
          pagination={{pageSize: 10}}
        />
      )}

      {/* 추가 및 수정 모달 */}
      <Modal title="🔧 토큰 무시 URL 설정" open={isModalOpen} onCancel={handleCancel} onOk={handleSave}>
        <Form form={form} layout="vertical">
          <Form.Item name="url" label="URL" rules={[{ required: true, message: "URL을 입력하세요!" }]}>
            <Input placeholder="/test" />
          </Form.Item>

          <Form.Item name="isIgnore" label="토큰 인증 설정" valuePropName="checked">
            <Switch
              checked={switchState} // 상태값 반영 (실시간 업데이트)
              onChange={handleSwitchChange} // 상태 변경 시 업데이트
              checkedChildren="토큰 인증 제외"  // ON (빨간색)
              unCheckedChildren="토큰 인증 사용"  // OFF (초록색)
              style={{
                backgroundColor: switchState ? "#f5222d" : "#52c41a", // 색상 실시간 변경
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
        okButtonProps={{danger: true}}
      >
        <p>정말로 <strong>{selectedRecord?.url}</strong>을(를) 삭제하시겠습니까?</p>
      </Modal>
    </div>
  );
}
