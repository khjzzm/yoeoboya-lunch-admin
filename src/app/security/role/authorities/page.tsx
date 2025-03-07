"use client";

import { Table, Spin, Switch } from "antd";
import { ColumnsType } from "antd/es/table";
import { useFetchRole, useUpdateRole } from "@/lib/api/useFetchRole";

// ✅ Role 데이터 타입 정의
interface RoleData {
  loginId: string;
  email: string;
  name: string;
  provider: string;
  enabled: boolean;
  accountNonLocked: boolean;
}

export default function RoleAuthoritiesPage() {
  // ✅ API 데이터 가져오기
  const { data, isLoading, error } = useFetchRole();
  const updateRole = useUpdateRole();

  // ✅ 활성화 상태 변경 핸들러
  const handleToggleEnabled = (record: RoleData) => {
    updateRole.mutate({ loginId: record.loginId, enabled: !record.enabled, accountNonLocked: record.accountNonLocked });
  };

  // ✅ 계정 잠금 상태 변경 핸들러
  const handleToggleAccountLock = (record: RoleData) => {
    updateRole.mutate({ loginId: record.loginId, enabled: record.enabled, accountNonLocked: !record.accountNonLocked });
  };

  // ✅ 컬럼 정의 (ColumnsType 사용)
  const columns: ColumnsType<RoleData> = [
    { title: "로그인 ID", dataIndex: "loginId", key: "loginId" },
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "이름", dataIndex: "name", key: "name" },
    { title: "인증 제공자", dataIndex: "provider", key: "provider" },
    {
      title: "활성화 여부",
      dataIndex: "enabled",
      key: "enabled",
      render: (_, record) => (
        <Switch
          checked={record.enabled}
          onChange={() => handleToggleEnabled(record)}
        />
      ),
    },
    {
      title: "계정 잠금 여부",
      dataIndex: "accountNonLocked",
      key: "accountNonLocked",
      render: (_, record) => (
        <Switch
          checked={record.accountNonLocked}
          onChange={() => handleToggleAccountLock(record)}
        />
      ),
    },
  ];

  // ✅ 데이터 로딩 중이면 스피너 표시
  if (isLoading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (error) return <p>데이터를 불러오는 중 오류 발생 🚨</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-lg font-semibold">🔐 권한 정보</h1>

      {/* ✅ 데이터 테이블 */}
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