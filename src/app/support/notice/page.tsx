"use client";

import { Button, List, Pagination, Tag } from "antd";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { BoardSearchOptions, BoardSearchCondition, BoardSearchType, NoticeResponse } from "@/types";

import SearchFilters from "@/components/searchFilters";

import { useNotices } from "@/lib/queries/support/useNotice";
import { isRead, markAsRead } from "@/lib/utils/readHistory";

import { useAuthStore } from "@/store/useAuthStore";

export default function NoticeListPage() {
  const { isManager } = useAuthStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<BoardSearchCondition>({});
  const { data: notice, isLoading } = useNotices(page, pageSize, filters);

  const handleSearch = (searchFilters: Record<string, string | string[]>) => {
    const [[key, value]] = Object.entries(searchFilters);

    setFilters({
      searchType: key as BoardSearchType,
      keyword: value as string,
    });

    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const list = notice?.data.list || [];
  const pagination = notice?.data.pagination;

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchFilters onSearch={handleSearch} filterOptions={BoardSearchOptions} />
        {isManager() && (
          <Button type="primary" onClick={() => router.push("/support/notice/write")}>
            글쓰기
          </Button>
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

      <List<NoticeResponse>
        loading={isLoading}
        dataSource={list}
        renderItem={(item) => {
          const isExpired = dayjs(item.endDate).isBefore(dayjs());

          return (
            <List.Item
              onClick={() => {
                router.push(`/support/notice/view?id=${item.id}`);
                markAsRead(item.id);
              }}
              className={`hover:bg-gray-50 px-2 md:px-4 py-3 cursor-pointer border-b ${item.pinned ? "bg-yellow-50" : ""}`}
            >
              <div className="flex flex-col md:flex-row w-full items-start md:items-center text-xs md:text-sm gap-y-1 md:gap-0">
                <div className="w-full md:w-16 text-left md:text-center shrink-0">{item.id}</div>

                <div className="w-full md:w-20 text-left md:text-center shrink-0">
                  <Tag>{item.category}</Tag>
                </div>

                <div className="w-full md:flex-1 text-left truncate min-w-0">
                  <div className="flex items-center gap-1">
                    {item.hasFile && <span>📷</span>}
                    {item.pinned && <Tag color="gold">공지</Tag>}
                    <span className={`line-clamp-1 ${isRead(item.id) && "text-purple-500"}`}>
                      {" "}
                      {item.title}{" "}
                    </span>
                    <span className="text-gray-400">({item.replyCount})</span>
                    {isExpired && <Tag color="red">기간 종료</Tag>}
                  </div>
                </div>

                <div className="w-full md:w-24 text-left md:text-center truncate">
                  {item.author}
                </div>
                <div className="w-full md:w-24 text-left md:text-center whitespace-nowrap">
                  {dayjs(item.createDate).format("YY.MM.DD")}
                </div>
                <div className="w-full md:w-16 text-left md:text-center">{item.viewCount}</div>
                <div className="w-full md:w-16 text-left md:text-center">{item.likeCount}</div>
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
            setPage(1); // 페이지 초기화
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
