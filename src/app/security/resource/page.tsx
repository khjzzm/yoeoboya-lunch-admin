"use client";

import {useState} from "react";
import {useResources, useAddResourceRole} from "@/lib/api/useResources";
import {Table, Tooltip, Select, Tag} from "antd";
import type {ColumnsType} from "antd/es/table";
import {apiErrorMessage} from "@/lib/utils/apiErrorMessage";

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
  {label: "어드민", value: "ROLE_ADMIN"},
  {label: "매니저", value: "ROLE_MANAGER"},
  {label: "유저", value: "ROLE_USER"},
  {label: "게스트", value: "ROLE_GUEST"},
  {label: "차단", value: "ROLE_BLOCK"},
];

export default function ResourcesPage() {
  const {data, isLoading, error} = useResources();
  const resources: Resource[] = Array.isArray(data) ? data : [];
  const [pageSize, setPageSize] = useState(20);
  const addResourceRole = useAddResourceRole(); // 리소스 역할 추가 훅

  // 선택된 역할 값을 저장하는 상태 (원래 값 복구용)
  const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});

  const handleRoleChange = (resourceId: number, newRole: string) => {
    const prevRole = selectedRoles[resourceId] || data?.find((item: Resource) => item.resourceId === resourceId)?.roleDesc;
    setSelectedRoles((prev) => ({...prev, [resourceId]: newRole}));

    addResourceRole.mutate({resourceId, role: newRole}, {
        onError: (error) => {
          apiErrorMessage(error);
          setSelectedRoles((prev) => ({...prev, [resourceId]: prevRole}));
        },
      }
    );
  };

  // 테이블 컬럼 정의
  const columns: ColumnsType<Resource> = [
    {
      title: <div style={{textAlign: "center"}}>ID</div>,
      dataIndex: "resourceId",
      key: "resourceId",
      sorter: (a, b) => a.resourceId - b.resourceId,
    },
    {
      title: <div style={{textAlign: "center"}}>리소스 이름</div>,
      dataIndex: "resourceName",
      key: "resourceName",
      sorter: (a, b) => a.resourceName.localeCompare(b.resourceName),
      defaultSortOrder: "ascend",
      render: (text, record) => (
        <Tooltip title={record.resourceDesc || "설명 없음"}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <div style={{textAlign: "center"}}>HTTP 메서드</div>,
      dataIndex: "httpMethod",
      key: "httpMethod",
      render: (text) => {
        let color = "black";
        if (text === "GET") color = "blue";
        else if (text === "POST") color = "orange";
        else if (text === "DELETE") color = "red";
        else if (text === "PATCH") color = "green";

        return <Tag color={color}>{text || "-"}</Tag>;
      },
      sorter: (a, b) => (a.httpMethod || "").localeCompare(b.httpMethod || ""),
    },
    {
      title: <div style={{textAlign: "center"}}>순서</div>,
      dataIndex: "orderNum",
      key: "orderNum",
      sorter: (a, b) => a.orderNum - b.orderNum,
    },
    {
      title: <div style={{textAlign: "center"}}>리소스 타입</div>,
      dataIndex: "resourceType",
      key: "resourceType",
      sorter: (a, b) => a.resourceType.localeCompare(b.resourceType),
    },
    {
      title: <div style={{textAlign: "center"}}>권한</div>,
      dataIndex: "roleDesc",
      key: "roleDesc",
      render: (text, record) => (
        <Select
          value={selectedRoles[record.resourceId] ?? text ?? ""}
          style={{width: 150}}
          options={roleOptions}
          onChange={(value) => handleRoleChange(record.resourceId, value)}
          disabled={record.resourceType === "ROLE"}
        />
      ),
      sorter: (a, b) => (a.roleDesc || "").localeCompare(b.roleDesc || ""),
    },
  ];

  if (error) return <p>데이터를 불러오는 중 오류 발생 🚨</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">📌 리소스 관리</h1>
      <Table
        dataSource={resources}
        columns={columns}
        rowKey="resourceId"
        loading={isLoading}
        pagination={{
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: [10, 20, 50, 100], //  올바른 숫자 배열로 설정
          showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
          onChange: (page, pageSize) => {
            setPageSize(pageSize); // 선택한 페이지 크기로 상태 업데이트
          },
        }}
      />
    </div>
  );
}
