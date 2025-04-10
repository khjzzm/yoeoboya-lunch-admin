"use client";

import { Select, Table, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

import { roleOptions, RoleResource } from "@/types";

import { useAddResourceRole, useResources } from "@/lib/queries";
import { apiErrorMessage } from "@/lib/utils/apiErrorMessage";

export default function ResourcesPage() {
  const { data: resources = [], isLoading, error } = useResources();
  const [pageSize, setPageSize] = useState(20);
  const addResourceRole = useAddResourceRole();

  const [selectedRoles, setSelectedRoles] = useState<Record<number, string>>({});

  const handleRoleChange = (resourceId: number, newRole: string) => {
    const currentResource = resources.find((item) => item.resourceId === resourceId);
    const prevRole = selectedRoles[resourceId] ?? currentResource?.roleDesc ?? "";

    setSelectedRoles((prev) => ({ ...prev, [resourceId]: newRole }));

    addResourceRole.mutate(
      { resourceId, role: newRole },
      {
        onError: (error) => {
          apiErrorMessage(error);
          setSelectedRoles((prev) => ({ ...prev, [resourceId]: prevRole }));
        },
      },
    );
  };

  const columns: ColumnsType<RoleResource> = [
    {
      title: <div style={{ textAlign: "center" }}>ID</div>,
      dataIndex: "resourceId",
      key: "resourceId",
      width: 80,
      sorter: (a, b) => a.resourceId - b.resourceId,
    },
    {
      title: <div style={{ textAlign: "center" }}>리소스 이름</div>,
      dataIndex: "resourceName",
      key: "resourceName",
      width: 200,
      sorter: (a, b) => a.resourceName.localeCompare(b.resourceName),
      defaultSortOrder: "ascend",
      render: (text, record) => (
        <Tooltip title={record.resourceDesc || "설명 없음"}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: <div style={{ textAlign: "center" }}>HTTP 메서드</div>,
      dataIndex: "httpMethod",
      key: "httpMethod",
      width: 120,
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
      title: <div style={{ textAlign: "center" }}>순서</div>,
      dataIndex: "orderNum",
      key: "orderNum",
      width: 100,
      sorter: (a, b) => a.orderNum - b.orderNum,
    },
    {
      title: <div style={{ textAlign: "center" }}>리소스 타입</div>,
      dataIndex: "resourceType",
      key: "resourceType",
      width: 150,
      sorter: (a, b) => a.resourceType.localeCompare(b.resourceType),
    },
    {
      title: <div style={{ textAlign: "center" }}>권한</div>,
      dataIndex: "roleDesc",
      key: "roleDesc",
      width: 180,
      render: (text, record) => (
        <Select
          value={selectedRoles[record.resourceId] ?? text ?? ""}
          style={{ width: 150 }}
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
      <div className="overflow-x-auto">
        <Table
          dataSource={resources}
          columns={columns}
          rowKey="resourceId"
          loading={isLoading}
          scroll={{ x: "max-content" }}
          pagination={{
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: [10, 20, 50, 100],
            showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
            onChange: (_, pageSize) => setPageSize(pageSize),
          }}
        />
      </div>
    </div>
  );
}
