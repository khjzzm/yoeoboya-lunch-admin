"use client";

import { useNotices, useDeleteNotice } from "@/lib/api/useSupport";
import { useRouter } from "next/navigation";
import { Table, Button, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EditOutlined  } from "@ant-design/icons";
import type { NoticeResponse } from "@/types/support";
import dayjs from "dayjs";

export default function NoticeListPage() {
  const router = useRouter();
  const { data, isLoading } = useNotices();
  const deleteNotice = useDeleteNotice();

  const handleEdit = (id: number) => {
    router.push(`/support/notice/write?noticeId=${id}`);
  };

  const handleDelete = (id: number) => {
    deleteNotice.mutate(id);
  };

  const columns = [
    {
      title: "제목",
      dataIndex: "title",
      key: "title",
      render: (text: string, record: NoticeResponse) => (
        <Button type="link" onClick={() => router.push(`/support/notice/view/${record.id}`)}>
          {text}
        </Button>
      ),
    },
    {
      title: "카테고리",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "작성자",
      dataIndex: "author",
      key: "author",
    },
    {
      title: "조회수",
      dataIndex: "viewCount",
      key: "viewCount",
    },
    {
      title: "우선순위",
      dataIndex: "priority",
      key: "priority",
      render: (priority: number) => {
        const label = ["낮음", "보통", "높음"][priority];
        const color = ["default", "blue", "red"][priority];
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const label = {
          ACTIVE: "활성",
          INACTIVE: "비활성",
          DELETED: "삭제됨",
        }[status];
        return <Tag>{label}</Tag>;
      },
    },
    {
      title: "작성일",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "액션",
      key: "action",
      render: (_: unknown, record: NoticeResponse) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record.id)} />
          <Popconfirm
            title="정말 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.id)}
            okText="네"
            cancelText="아니요"
          >
            <Button icon={<DeleteOutlined />} danger className="ml-2" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📋 공지사항 목록</h1>
        <Button type="primary" onClick={() => router.push("/support/notice/write")}>글쓰기</Button>
      </div>

      <Table
        dataSource={data || []}
        columns={columns}
        rowKey="id"
        loading={isLoading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}
