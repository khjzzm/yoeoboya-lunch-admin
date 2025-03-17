"use client";

import {useMembers} from "@/lib/api/useMembers";
import {Table} from "antd";
import {useState} from "react";
import SearchFilters from "@/lib/utils/searchFilters";


export default function MemberPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const handleSearch = (newFilters: { [key: string]: string | string[] }) => {
    setFilters(newFilters);
  };
  const {data, error, isLoading} = useMembers(page, pageSize, filters);
  const members = data?.data?.list || [];
  const totalMembers = data?.data?.pagination?.totalElements || 0;

  //  테이블 컬럼 정의
  const columns = [
    {
      title: <div style={{textAlign: "center"}}>로그인 ID</div>,
      dataIndex: "loginId",
      key: "loginId",
    },
    {
      title: <div style={{textAlign: "center"}}>이메일</div>,
      dataIndex: "email",
      key: "email",
    },
    {
      title: <div style={{textAlign: "center"}}>이름</div>,
      dataIndex: "name",
      key: "name",
    },
    {
      title: <div style={{textAlign: "center"}}>닉네임</div>,
      dataIndex: "nickName",
      key: "nickName",
    },
    {
      title: <div style={{textAlign: "center"}}>전화번호</div>,
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: <div style={{textAlign: "center"}}>계좌 정보</div>,
      dataIndex: "account",
      key: "account",
      render: (account: boolean) => (account ? "✅ 등록됨" : "❌ 미등록"),
    },
  ];

  if (error) return <p>데이터를 불러오는 중 오류 발생 🚨</p>;
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">👤 사용자 목록</h1>

      {/* 필터 컴포넌트 */}
      <SearchFilters onSearch={handleSearch} filterOptions={[
        {label: "로그인 ID", value: "loginId"},
        {label: "이름", value: "name"},
        {label: "닉네임", value: "nickName"},
      ]}/>

      <Table
        dataSource={members}
        columns={columns}
        rowKey="loginId"
        loading={isLoading}
        pagination={{
          current: page,
          total: totalMembers,
          pageSize: pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50", "100"],
          showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
        }}
      />
    </div>
  );
}
