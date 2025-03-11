"use client";

import { useFetchResources, useAddResourceRole } from "@/lib/api/useFetchResources";
import { Table, Spin, Tooltip, Select, Tag} from "antd";
import type { ColumnsType } from "antd/es/table";

interface Resource {
  resourceId: number;
  resourceName: string;
  resourceDesc: string | null;
  httpMethod: string | null;
  orderNum: number;
  resourceType: string;
  roleDesc: string | null;
}

const roleOptions = [
  { label: "관리자", value: "ROLE_ADMIN" },
  { label: "매니저", value: "ROLE_MANAGER" },
  { label: "일반 사용자", value: "ROLE_USER" },
  { label: "게스트", value: "ROLE_GUEST" },
  { label: "차단된 사용자", value: "ROLE_BLOCK" },
];

export default function ResourcesPage() {
  const { data, isLoading, error } = useFetchResources();
  const addResourceRole = useAddResourceRole(); // 리소스 역할 추가 훅

  // 데이터가 undefined일 경우 대비하여 기본값 설정
  const resources: Resource[] = Array.isArray(data) ? data : [];

  // 권한 변경 함수
  const handleRoleChange = (resourceId: number, newRole: string) => {
    addResourceRole.mutate({ resourceId, role: newRole });
  };

  // 테이블 컬럼 정의
  const columns: ColumnsType<Resource> = [
    {
      title: "ID",
      dataIndex: "resourceId",
      key: "resourceId",
      sorter: (a, b) => a.resourceId - b.resourceId,
    },
    {
      title: "리소스 이름",
      dataIndex: "resourceName",
      key: "resourceName",
      sorter: (a, b) => a.resourceName.localeCompare(b.resourceName),
      defaultSortOrder: "ascend", // 기본 정렬
      render: (text, record) => (
        <Tooltip title={record.resourceDesc || "설명 없음"}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: "HTTP 메서드",
      dataIndex: "httpMethod",
      key: "httpMethod",
      render: (text) => {
        let color = "black"; // 기본값

        if (text === "GET") color = "blue";
        else if (text === "POST") color = "orange"
        else if (text === "DELETE") color = "red";
        else if (text === "PATCH") color = "green";

        return <Tag color={color}>{text || "-"}</Tag>;
      },
      sorter: (a, b) => (a.httpMethod || "").localeCompare(b.httpMethod || ""),
    },
    {
      title: "순서",
      dataIndex: "orderNum",
      key: "orderNum",
      sorter: (a, b) => a.orderNum - b.orderNum,
    },
    {
      title: "리소스 타입",
      dataIndex: "resourceType",
      key: "resourceType",
      sorter: (a, b) => a.resourceType.localeCompare(b.resourceType),
    },
    {
      title: "권한",
      dataIndex: "roleDesc",
      key: "roleDesc",
      render: (text, record) => (
        <Select
          defaultValue={text || ""}
          style={{ width: 150 }}
          options={roleOptions}
          onChange={(value) => handleRoleChange(record.resourceId, value)}
        />
      ),
      sorter: (a, b) => (a.roleDesc || "").localeCompare(b.roleDesc || ""),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-lg font-semibold">📌 리소스 목록</h1>
      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : error ? (
        <p style={{ color: "red" }}>🚨 데이터를 불러오는 중 오류 발생</p>
      ) : (
        <Table
          dataSource={resources}
          columns={columns}
          rowKey="resourceId"
          pagination={{ pageSize: 20 }}
        />
      )}
    </div>
  );
}