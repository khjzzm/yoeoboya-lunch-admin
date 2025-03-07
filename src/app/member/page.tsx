"use client";

import { useFetchMembers } from "@/lib/api/useFetchMembers";
import { Table, Spin } from "antd";


export default function MemberPage() {
  const { data, isLoading } = useFetchMembers();

  // ✅ 데이터가 없을 경우 대비
  const members = data?.data?.list || [];

  // ✅ 테이블 컬럼 정의
  const columns = [
    { title: "로그인 ID", dataIndex: "loginId", key: "loginId" },
    { title: "이메일", dataIndex: "email", key: "email" },
    { title: "이름", dataIndex: "name", key: "name" },
    { title: "닉네임", dataIndex: "nickName", key: "nickName" },
    { title: "전화번호", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "계좌 정보",
      dataIndex: "account",
      key: "account",
      render: (account: boolean) => (account ? "✅ 등록됨" : "❌ 미등록"),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-lg font-semibold">👤 사용자 목록</h1>
      {isLoading ? <Spin /> : <Table dataSource={members} columns={columns} rowKey="loginId" />}
    </div>
  );
}