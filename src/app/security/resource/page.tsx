"use client";

import { useFetchResources } from "@/lib/api/useFetchResources"; // 경로 확인
import { Table, Spin } from "antd";

export default function ResourcesPage() {
  const { data, isLoading, error } = useFetchResources();

  // ✅ 데이터가 undefined일 경우 대비하여 기본값 설정
  const resources = Array.isArray(data) ? data : []; // 배열 보장

  // ✅ 테이블 컬럼 정의
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "리소스 이름", dataIndex: "resourceName", key: "resourceName" },
    { title: "HTTP 메서드", dataIndex: "httpMethod", key: "httpMethod", render: (text: string | null) => text || "-" },
    { title: "순서", dataIndex: "orderNum", key: "orderNum" },
    { title: "리소스 타입", dataIndex: "resourceType", key: "resourceType" },
    { title: "설명", dataIndex: "roleDesc", key: "roleDesc", render: (text: string | null) => text || "-" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 className="text-lg font-semibold">📌 리소스 목록</h1>
      {isLoading ? (
        <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
      ) : error ? (
        <p style={{ color: "red" }}>🚨 데이터를 불러오는 중 오류 발생</p>
      ) : (
        <Table dataSource={resources} columns={columns} rowKey="id" />
      )}
    </div>
  );
}