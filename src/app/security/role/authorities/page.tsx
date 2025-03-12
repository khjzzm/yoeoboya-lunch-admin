"use client";

import { Table, Spin, Switch, Tooltip, Select } from "antd";
import { ColumnsType } from "antd/es/table";
import { useFetchRole, useUpdateSecurityStatus, useUpdateRole } from "@/lib/api/useFetchRole";

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

// 역할 목록 및 매핑
const roleOptions = [
  { label: "어드민", value: "ROLE_ADMIN" },
  { label: "매니저", value: "ROLE_MANAGER" },
  { label: "유저", value: "ROLE_USER" },
  { label: "게스트", value: "ROLE_GUEST" },
  { label: "차단", value: "ROLE_BLOCK" },
];

export default function RoleAuthoritiesPage() {
  const { data, isLoading, error } = useFetchRole();
  const updateSecurityStatus = useUpdateSecurityStatus();
  const updateRole = useUpdateRole();

  // 활성화 상태 변경 핸들러
  const handleToggleEnabled = (record: RoleData) => {
    updateSecurityStatus.mutate({
      loginId: record.loginId,
      enabled: !record.enabled,
      accountNonLocked: record.accountNonLocked,
    });
  };

  // 계정 잠금 상태 변경 핸들러
  const handleToggleAccountLock = (record: RoleData) => {
    updateSecurityStatus.mutate({
      loginId: record.loginId,
      enabled: record.enabled,
      accountNonLocked: !record.accountNonLocked,
    });
  };

  // 역할 변경 핸들러
  const handleRoleChange = (loginId: string, newRole: string) => {
    updateRole.mutate({ loginId, role: newRole });
  };

  // 컬럼 정의 (ColumnsType 사용)
  const columns: ColumnsType<RoleData> = [
    { title: "로그인 ID", dataIndex: "loginId", key: "loginId" },
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "이름", dataIndex: "name", key: "name" },
    { title: "인증 제공자", dataIndex: "provider", key: "provider" },

    {
      title: "역할",
      dataIndex: "authority",
      key: "authority",
      render: (role, record) => (
        <Select
          value={role}
          onChange={(newRole) => handleRoleChange(record.loginId, newRole)}
          options={roleOptions}
          style={{ width: 150 }}
        />
      ),
    },

    {
      title: "활성화 상태",
      dataIndex: "enabled",
      key: "enabled",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title={record.enabled ? "사용 가능" : "계정이 비활성화 상태입니다."}>
            <Switch checked={record.enabled} onChange={() => handleToggleEnabled(record)} />
          </Tooltip>
        </div>
      ),
    },

    {
      title: "계정 상태",
      dataIndex: "accountNonLocked",
      key: "accountNonLocked",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <Tooltip title={record.accountNonLocked ? "사용 가능" : "계정이 잠겨 있습니다"}>
            <Switch
              checked={record.accountNonLocked}
              onChange={() => handleToggleAccountLock(record)}
              style={{ backgroundColor: record.accountNonLocked ? "#52c41a" : "#f5222d" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  // 데이터 로딩 중이면 스피너 표시
  if (isLoading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (error) return <p>데이터를 불러오는 중 오류 발생 🚨</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-lg font-semibold">🔐 권한 정보</h1>

      {/* 데이터 테이블 */}
      <Table
        dataSource={data?.data.list || []}
        columns={columns}
        rowKey="loginId"
        pagination={{
          current: data?.data.pagination.page || 1,
          total: data?.data.pagination.totalElements || 0,
          pageSize: 10,
        }}
      />
    </div>
  );
}