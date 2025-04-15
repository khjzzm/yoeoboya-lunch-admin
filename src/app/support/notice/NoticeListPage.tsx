"use client";

import { List, Pagination, Tag } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import { BoardSearchCondition, BoardSearchOptions, BoardSearchType, NoticeResponse } from "@/types";

import Btn from "@/components/common/Btn";
import SearchFilters from "@/components/filters/SearchFilters";

import { usePaginationQuerySync } from "@/lib/hooks/usePaginationQuerySync";
import { useNotices } from "@/lib/queries/support/useNotice";
import { isRead, markAsRead } from "@/lib/utils/readHistory";

import { useAuthStore } from "@/store/useAuthStore";

export default function NoticeListPage() {
  const { isManager } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { page, pageSize, setPagination } = usePaginationQuerySync();

  const filters: BoardSearchCondition = useMemo(() => {
    const searchType = searchParams.get("searchType") as BoardSearchType | undefined;
    const keyword = searchParams.get("keyword") || undefined;

    return searchType && keyword ? { searchType, keyword } : {};
  }, [searchParams]);

  const { data, isLoading } = useNotices(page, pageSize, filters);
  const list = data?.list || [];
  const pagination = data?.pagination;

  const handleSearch = (params: Record<string, string | string[]>) => {
    const [[key, value]] = Object.entries(params);
    const query = new URLSearchParams(searchParams.toString());
    query.set("searchType", key);
    query.set("keyword", value as string);
    query.set("page", "1");
    router.push(`${pathname}?${query.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchFilters onSearch={handleSearch} filterOptions={BoardSearchOptions} />
        {isManager() && <Btn text="글쓰기" onClick={() => router.push("/support/notice/write")} />}
      </div>

      {/*  상단 헤더 */}
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
        renderItem={(item, index) => {
          const isExpired = dayjs(item.endDate).isBefore(dayjs());
          const isLast = list && index === list.length - 1;

          return (
            <List.Item
              onClick={() => {
                router.push(`/support/notice/view?boardNo=${item.boardNo}`);
                markAsRead(item.boardNo);
              }}
              className={`hover:bg-gray-50 px-2 md:px-4 py-3 cursor-pointer border-b ${item.pinned ? "bg-yellow-50" : ""}`}
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                borderBottom: isLast ? "1px solid #29367c" : undefined,
              }}
            >
              <div className="flex flex-col md:flex-row w-full items-start md:items-center text-xs md:text-sm gap-y-1 md:gap-0">
                <div className="w-full md:w-16 text-left md:text-center shrink-0">
                  {item.boardNo}
                </div>
                <div className="w-full md:w-20 text-left md:text-center shrink-0">
                  <Tag>{item.category}</Tag>
                </div>
                <div className="w-full md:flex-1 text-left truncate min-w-0">
                  <div className="flex items-center gap-1">
                    {item.hasFile && <span>📷</span>}
                    <span
                      className={`line-clamp-1`}
                      style={{
                        color: isRead(item.boardNo) ? "#770088" : "black",
                      }}
                    >
                      {item.title}
                    </span>
                    {item.replyCount > 0 && (
                      <span className="text-xs text-orange-600 ml-1">[{item.replyCount}]</span>
                    )}
                    {isExpired && (
                      <Tag bordered={false} color="red">
                        <span>기간종료</span>
                      </Tag>
                    )}
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
          showSizeChanger
          pageSizeOptions={["20", "30", "50"]}
          onChange={(newPage, newSize) => {
            setPagination(newPage, newSize);
          }}
          locale={{ items_per_page: "개" }}
        />
      </div>
    </div>
  );
}
