"use client";

import { Button, List, Pagination } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

import {
  BoardSearchCondition,
  BoardSearchOptions,
  BoardSearchType,
  FreeBoardResponse,
} from "@/types";

import SearchFilters from "@/components/filters/SearchFilters";

import { usePaginationQuerySync } from "@/lib/hooks/usePaginationQuerySync";
import { useFreeBoards } from "@/lib/queries/board/useFreeBoard";
import { isRead, markAsRead } from "@/lib/utils/readHistory";

export default function FreeListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page, pageSize, setPagination } = usePaginationQuerySync();

  const filters: BoardSearchCondition = useMemo(() => {
    const searchType = searchParams.get("searchType") as BoardSearchType | undefined;
    const keyword = searchParams.get("keyword") || undefined;

    return searchType && keyword ? { searchType, keyword } : {};
  }, [searchParams]);

  const { data, isLoading } = useFreeBoards(page, pageSize, filters);
  const list = data?.data.list || [];
  const pagination = data?.data.pagination;

  const handleSearch = (params: Record<string, string | string[]>) => {
    const [[key, value]] = Object.entries(params);
    const url = new URLSearchParams(searchParams.toString());
    url.set("searchType", key);
    url.set("keyword", value as string);
    url.set("page", "1"); // 검색 시 페이지 초기화
    router.push(`${pathname}?${url.toString()}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchFilters onSearch={handleSearch} filterOptions={BoardSearchOptions} />
        <Button type="primary" onClick={() => router.push("/board/free/write")}>
          글쓰기
        </Button>
      </div>

      <List<FreeBoardResponse>
        loading={isLoading}
        dataSource={list}
        renderItem={(item) => (
          <List.Item className="px-3 py-3 border-b transition-all">
            <div className="w-full flex flex-col gap-1">
              {/* 작성자 + 시간 */}
              <div className="flex justify-between text-xs text-gray-500">
                <span
                  className="truncate cursor-pointer hover:underline"
                  onClick={() => handleSearch({ author: item.name })}
                >
                  {item.name}
                </span>
                <span>{dayjs(item.createdDate).format("YY.MM.DD HH:mm")}</span>
              </div>

              {/* 제목 클릭 → 상세 페이지 이동 */}
              <div
                className={`font-semibold text-sm truncate hover:underline cursor-pointer ${
                  isRead(item.boardNo) ? "text-purple-500" : "text-black"
                }`}
                onClick={() => {
                  router.push(`/board/free/view?boardNo=${item.boardNo}`);
                  markAsRead(item.boardNo);
                }}
              >
                {item.secret && "🔒"} {item.title}
              </div>

              {/* 카테고리 + 해시태그 */}
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                <span
                  className="text-blue-500 font-medium cursor-pointer"
                  onClick={() => handleSearch({ category: item.category })}
                >
                  [{item.category}]
                </span>
                {item.hashTag?.map((tagObj) => (
                  <span
                    key={tagObj.tag}
                    className="text-gray-400 cursor-pointer"
                    onClick={() => handleSearch({ hashtag: tagObj.tag })}
                  >
                    #{tagObj.tag}
                  </span>
                ))}
              </div>

              {/* 좋아요/댓글/조회수 */}
              <div className="flex justify-end gap-3 text-xs text-gray-500">
                <span>👀 {item.viewCount}</span>
                <span>👍 {item.likeCount}</span>
                <span>💬 {item.replyCount}</span>
              </div>
            </div>
          </List.Item>
        )}
      />

      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={pagination?.totalElements ?? 0}
          onChange={(newPage, newSize) => {
            setPagination(newPage, newSize);
          }}
          showSizeChanger
          pageSizeOptions={["10", "20", "30"]}
          locale={{ items_per_page: "개" }}
        />
      </div>
    </div>
  );
}
