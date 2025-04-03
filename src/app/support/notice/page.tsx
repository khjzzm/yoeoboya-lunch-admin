"use client";

import { useRouter } from "next/navigation";
import { Button, List, Pagination, Tag } from "antd";
import { useNotices } from "@/lib/queries/useSupport";
import { useState } from "react";
import SearchFilters from "@/components/searchFilters";
import { NoticeDetailResponse } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import dayjs from "dayjs";

export default function NoticeListPage() {
  const { isManager } = useAuthStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});
  const { data: notice, isLoading } = useNotices(page, pageSize, filters);

  const handleSearch = (searchFilters: Record<string, string | string[]>) => {
    const keys = Object.keys(searchFilters);
    const key = keys[0];
    const value = searchFilters[key];

    if (typeof value === "string") {
      setFilters({
        searchType: key,
        keyword: value,
      });
    } else {
      setFilters({});
    }

    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const list = notice?.data.list || [];
  const pagination = notice?.data.pagination;

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0">
      <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">📋 공지사항 목록</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchFilters
          onSearch={handleSearch}
          filterOptions={[
            {label: "제목+내용", value: "TITLE_CONTENT"},
            {label: "제목", value: "TITLE"},
            {label: "내용", value: "CONTENT"},
            {label: "작성자", value: "AUTHOR"},
            {label: "댓글", value: "COMMENT"},
          ]}
        />
        {isManager() && (
          <Button type="primary" onClick={() => router.push("/support/notice/write")}>글쓰기</Button>
        )}
      </div>

      <div className="hidden md:flex py-2 font-semibold text-gray-500 border-b bg-gray-50 text-sm">
        <div className="w-16 text-center shrink-0">번호</div>
        <div className="w-20 text-center shrink-0">카테고리</div>
        <div className="flex-1 text-center">제목</div>
        <div className="w-24 text-center shrink-0">작성자</div>
        <div className="w-24 text-center shrink-0">작성일자</div>
        <div className="w-16 text-center shrink-0">조회</div>
        <div className="w-16 text-center shrink-0">추천</div>
      </div>

      <List<NoticeDetailResponse>
        loading={isLoading}
        dataSource={list}
        renderItem={(item) => {
          const isExpired = dayjs(item.endDate).isBefore(dayjs());

          return (
            <List.Item
              onClick={() => router.push(`/support/notice/view?id=${item.id}`)}
              className={`hover:bg-gray-50 px-2 md:px-4 py-3 cursor-pointer border-b ${item.pinned ? "bg-yellow-50" : ""}`}
            >
              <div
                className="flex flex-col md:flex-row w-full items-start md:items-center text-xs md:text-sm gap-1 md:gap-0">
                <div className="w-16 text-center shrink-0">{item.id}</div>
                <div className="w-20 text-center shrink-0">
                  <Tag>{item.category}</Tag>
                </div>
                <div className="flex-1 truncate text-left">
                  {item.hasFile && <span className="mr-1">📷</span>}
                  {item.pinned && <Tag color="gold">공지</Tag>} {item.title} ({item.replyCount})
                  {isExpired && <Tag color="red" className="ml-2">기간 종료</Tag>}
                </div>
                <div className="w-24 text-center shrink-0 truncate">{item.author}</div>
                <div className="w-24 text-center shrink-0">{dayjs(item.createDate).format("YY.MM.DD")}</div>
                <div className="w-16 text-center shrink-0">{item.viewCount}</div>
                <div className="w-16 text-center shrink-0">{item.likeCount}</div>
              </div>
            </List.Item>
          );
        }}
      />

      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          total={pagination?.totalElements ?? 0}
          pageSize={pageSize}
          showSizeChanger={true}
          pageSizeOptions={["10", "30", "50"]}
          onChange={handlePageChange}
          onShowSizeChange={(_, newSize) => {
            setPage(1);         // 페이지 초기화
            setPageSize(newSize); // 페이지 사이즈 변경
          }}
          locale={{
            items_per_page: "개",
          }}
        />
      </div>
    </div>
  );
}
