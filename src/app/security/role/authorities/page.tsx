"use client";

import { Select, Switch, Table, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { useState } from "react";

import { AuthoritiesOptions, roleOptions } from "@/types";

import SearchFilters from "@/components/searchFilters";

import { useRole, useUpdateRole, useUpdateSecurityStatus } from "@/lib/queries/useRole";

// Role 데이터 타입 정의
interface RoleData {
  loginId: string;
  email: string;
  name: string;
  provider: string;
  roleDesc: string;
  authority: string;
  enabled: boolean;
  accountNonLocked: boolean;
}

export default function RoleAuthoritiesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const handleSearch = (newFilters: { [key: string]: string | string[] }) => {
    setFilters(newFilters);
  };
  const { data, isLoading, error } = useRole(currentPage, pageSize, filters);
  const updateSecurityStatus = useUpdateSecurityStatus();
  const updateRole = useUpdateRole();

  // 상태 변경 핸들러들
  const handleToggleEnabled = (record: RoleData) => {
    updateSecurityStatus.mutate({
      loginId: record.loginId,
      enabled: !record.enabled,
      accountNonLocked: record.accountNonLocked,
    });
  };

  const handleToggleAccountLock = (record: RoleData) => {
    updateSecurityStatus.mutate({
      loginId: record.loginId,
      enabled: record.enabled,
      accountNonLocked: !record.accountNonLocked,
    });
  };

  const handleRoleChange = (loginId: string, newRole: string) => {
    updateRole.mutate({ loginId, role: newRole });
  };

  // 컬럼 정의
  const columns: ColumnsType<RoleData> = [
    { title: "로그인 ID", dataIndex: "loginId", key: "loginId", width: 150 },
    { title: "이메일", dataIndex: "email", key: "email", width: 200 },
    { title: "이름", dataIndex: "name", key: "name", width: 120 },
    { title: "인증 제공자", dataIndex: "provider", key: "provider", width: 130 },

    {
      title: "역할",
      dataIndex: "authority",
      key: "authority",
      width: 150,
      render: (role, record) => (
        <Select
          value={role}
          onChange={(newRole) => handleRoleChange(record.loginId, newRole)}
          options={roleOptions}
          style={{ width: 140 }}
        />
      ),
    },
    {
      title: "활성화 상태",
      dataIndex: "enabled",
      key: "enabled",
      width: 130,
      render: (_, record) => (
        <Tooltip title={record.enabled ? "사용 가능" : "계정이 비활성화 상태입니다."}>
          <Switch checked={record.enabled} onChange={() => handleToggleEnabled(record)} />
        </Tooltip>
      ),
    },
    {
      title: "계정 상태",
      dataIndex: "accountNonLocked",
      key: "accountNonLocked",
      width: 130,
      render: (_, record) => (
        <Tooltip title={record.accountNonLocked ? "사용 가능" : "계정이 잠겨 있습니다"}>
          <Switch
            checked={record.accountNonLocked}
            onChange={() => handleToggleAccountLock(record)}
            style={{ backgroundColor: record.accountNonLocked ? "#52c41a" : "#f5222d" }}
          />
        </Tooltip>
      ),
    },
  ];

  if (error) return <p>데이터를 불러오는 중 오류 발생 🚨</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">🔐 회원 권한</h1>

      <SearchFilters onSearch={handleSearch} filterOptions={AuthoritiesOptions} />

      <div className="overflow-x-auto">
        <Table
          dataSource={data?.data.list || []}
          columns={columns}
          rowKey="loginId"
          loading={isLoading}
          scroll={{ x: "max-content" }}
          pagination={{
            current: currentPage,
            total: data?.data?.pagination?.totalElements || 0,
            pageSize: pageSize,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
            onChange: (page, pageSize) => {
              setCurrentPage(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
    </div>
  );
}
