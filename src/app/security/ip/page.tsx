"use client";

import { Button, DatePicker, Form, Input, Modal, Popconfirm, Switch, Table } from "antd";
import { useEffect, useState } from "react";

import type { AccessIpFormFields, AccessIpRequest, AccessIpResponse } from "@/types";

import {
  useAccessIpList,
  useCreateAccessIp,
  useDeleteAccessIp,
  useUpdateAccessIp,
} from "@/lib/queries";
import dayjs from "@/lib/utils/dayjs";

export default function AdminAccessIpPage() {
  const [form] = Form.useForm<AccessIpFormFields>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIp, setEditingIp] = useState<AccessIpResponse | null>(null);

  const { data: ipList = [], refetch } = useAccessIpList();
  const create = useCreateAccessIp(refetch);
  const update = useUpdateAccessIp(refetch);
  const remove = useDeleteAccessIp(refetch);

  useEffect(() => {
    if (editingIp) {
      form.setFieldsValue({
        ...editingIp,
        expiresAt: editingIp.expiresAt ? dayjs(editingIp.expiresAt).tz("Asia/Seoul") : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [editingIp, form, modalOpen]);

  const handleSubmit = (values: AccessIpFormFields) => {
    const payload: AccessIpRequest = {
      ...values,
      expiresAt: values.expiresAt
        ? dayjs.tz(values.expiresAt, "Asia/Seoul").toDate().toISOString()
        : undefined,
    };

    // 디버그 로그
    console.log("⏰ expiresAt raw:", values.expiresAt?.toString());
    console.log("📦 전송:", payload.expiresAt);

    if (editingIp) {
      update.mutate({ id: editingIp.id, data: payload });
    } else {
      create.mutate(payload);
    }

    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button
          type="primary"
          onClick={() => {
            setModalOpen(true);
            setEditingIp(null);
          }}
        >
          IP 추가
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={ipList}
        columns={[
          { title: "IP 주소", dataIndex: "ipAddress", width: 150 },
          {
            title: "차단 여부",
            dataIndex: "block",
            width: 100,
            render: (val: boolean) => (val ? "차단" : "허용"),
          },
          {
            title: "차단 사유",
            dataIndex: "reason",
            width: 250,
            ellipsis: true,
          },
          {
            title: "차단 해제 시각",
            dataIndex: "expiresAt",
            width: 200,
            render: (val?: string) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm") : "-"),
          },
          {
            title: "시도 횟수",
            dataIndex: "hitCount",
            width: 100,
          },
          {
            title: "작업",
            width: 180,
            render: (_, record) => (
              <>
                <Button
                  size="small"
                  onClick={() => {
                    setModalOpen(true);
                    setEditingIp(record);
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
        scroll={{ x: true }}
      />

      <Modal
        title={editingIp ? "IP 수정" : "IP 추가"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="ipAddress"
            label="IP 주소"
            rules={[{ required: true, message: "IP 주소를 입력하세요" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="block" label="차단 여부" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Form.Item name="reason" label="차단 사유">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="expiresAt" label="만료일시">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
