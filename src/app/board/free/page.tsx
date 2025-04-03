"use client";

import {useState} from "react";
import {Button, List, Pagination} from "antd";
import {useRouter} from "next/navigation";
import {useFreeBoards} from "@/lib/queries/board/useFreeBoard";
import {BoardSearchCondition, BoardSearchOptions, BoardSearchType, FreeBoardResponse} from "@/types"
import SearchFilters from "@/components/searchFilters";
import dayjs from "dayjs";
import {isRead, markAsRead} from "@/lib/utils/readHistory";

export default function FreeBoardListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [filters, setFilters] = useState<BoardSearchCondition>({});
  const {data: free, isLoading} = useFreeBoards(page, pageSize, filters);

  const handleSearch = (searchFilters: Record<string, string | string[]>) => {
    const [[key, value]] = Object.entries(searchFilters);

    setFilters({
      searchType: key as BoardSearchType,
      keyword: value as string,
    });

    setPage(1);
  };

  const list = free?.data.list || [];
  const pagination = free?.data.pagination;

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchFilters
          onSearch={handleSearch}
          filterOptions={BoardSearchOptions}
        />
        <Button type="primary" onClick={() => router.push("/board/free/write")}>
          글쓰기
        </Button>
      </div>

      <List<FreeBoardResponse>
        loading={isLoading}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            onClick={() => {
              router.push(`/board/free/view?id=${item.boardId}`);
              markAsRead(item.boardId);
            }}
            className="cursor-pointer hover:bg-gray-50 py-2 px-3 border-b transition-all"
          >
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <div className={`font-medium text-sm truncate ${isRead(item.boardId) && "text-purple-500"}`}>
                  {item.title}
                </div>
                <div className="text-xs text-gray-400">
                  {dayjs(item.createDate).format("YY.MM.DD HH:mm")}
                </div>
              </div>
              <div className="text-xs text-gray-600 line-clamp-2 mb-1">{item.content}</div>
              <div className="flex justify-between text-[11px] text-gray-500">
                <div className="flex gap-1 items-center">
                  <span className="font-normal text-gray-700">{item.name}</span>
                </div>
                <div className="flex gap-2">
                  <span>👍 {item.likeCount}</span>
                  <span>💬 {item.replyCount}</span>
                  <span>👀 {item.viewCount}</span>
                </div>
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
            setPage(newPage);
            setPageSize(newSize ?? 10);
          }}
          showSizeChanger
          pageSizeOptions={["10", "20", "30"]}
        />
      </div>
    </div>
  );
}