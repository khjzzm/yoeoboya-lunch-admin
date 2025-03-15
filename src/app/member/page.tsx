"use client";

import { useMembers } from "@/lib/api/useMembers";
import { Table, Spin } from "antd";


export default function MemberPage() {
  const { data, isLoading } = useMembers();

  //  데이터가 없을 경우 대비
  const members = data?.data?.list || [];

  //  테이블 컬럼 정의
  const columns = [
    {
      title: <div style={{ textAlign: "center" }}>로그인 ID</div>,
      dataIndex: "loginId",
      key: "loginId",
    },
    {
      title: <div style={{ textAlign: "center" }}>이메일</div>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <div style={{ textAlign: "center" }}>이름</div>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <div style={{ textAlign: "center" }}>닉네임</div>,
      dataIndex: "nickName",
      key: "nickName",
    },
    {
      title: <div style={{ textAlign: "center" }}>전화번호</div>,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: <div style={{ textAlign: "center" }}>계좌 정보</div>,
      dataIndex: "account",
      key: "account",
      render: (account: boolean) => (account ? "✅ 등록됨" : "❌ 미등록"),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">👤 사용자 목록</h1>
      {isLoading ? <Spin/> : <Table dataSource={members} columns={columns} rowKey="loginId"/>}
    </div>
  );
}
