"use client";

import {useRouter} from "next/navigation";
import {Button, List, Pagination, Tag} from "antd";
import {useNotices} from "@/lib/api/useSupport";
import dayjs from "dayjs";
import {useState} from "react";
import SearchFilters from "@/lib/utils/searchFilters";
import {NoticeDetailResponse} from "@/types";
import {useAuthStore} from "@/store/useAuthStore";

export default function NoticeListPage() {
  const {isManager} = useAuthStore();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<Record<string, string | string[]>>({});

  const {data, isLoading} = useNotices(page, pageSize, filters);

  const handleSearch = (searchFilters: Record<string, string | string[]>) => {
    const keys = Object.keys(searchFilters);
    const key = keys[0]; // ex: "title_content"
    const value = searchFilters[key];

    if (typeof value === "string") {
      setFilters({
        searchType: key,
        keyword: value,
      });
    } else {
      setFilters({}); // 비어있으면 전체 조회
    }

    setPage(1); // 검색 시 1페이지로 초기화
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const list = data?.data.list || [];
  const pagination = data?.data.pagination;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">📋 공지사항 목록</h1>

      {/* 🔍 검색 + 글쓰기 */}
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
        {isManager() &&
          <Button type="primary" onClick={() => router.push("/support/notice/write")}>
            글쓰기
          </Button>
        }
      </div>

      {/* 헤더 */}
      <div className="hidden md:flex py-2 font-semibold text-gray-500 border-b bg-gray-50 text-sm">
        <div className="w-24 text-center">번호</div>
        <div className="w-24 text-center">카테고리</div>
        <div className="flex-1 text-center">제목</div>
        <div className="w-32 text-center">글쓴이</div>
        <div className="w-32 text-center">작성일자</div>
        <div className="w-20 text-center">조회수</div>
        <div className="w-20 text-center">추천</div>
      </div>

      {/* 리스트 */}
      <List<NoticeDetailResponse>
        loading={isLoading}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            onClick={() => router.push(`/support/notice/view?id=${item.id}`)}
            className="hover:bg-gray-50 px-4 py-3 cursor-pointer border-b"
          >
            <div className="flex flex-col md:flex-row w-full items-start md:items-center">
              <div className="w-24 flex items-center justify-center">{item.id}</div>
              <div className="w-24 flex items-center justify-center">
                <Tag>{item.category}</Tag>
              </div>
              <div className="flex-1 font-medium text-gray-900 truncate">{item.title}({item.replyCount})</div>
              <div className="w-32 text-sm text-gray-500 text-center truncate">{item.author}</div>
              <div className="w-32 flex items-center justify-center text-sm text-gray-500">
                {dayjs(item.createDate).format("YYYY.MM.DD")}
              </div>
              <div className="w-20 flex items-center justify-center text-sm text-gray-500">
                {item.viewCount}
              </div>
              <div className="w-20 flex items-center justify-center text-sm text-gray-500">
                {item.likeCount}
              </div>
            </div>
          </List.Item>
        )}
      />

      {/* ⏬ 페이징 */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          total={pagination?.totalElements ?? 0}
          pageSize={pageSize}
          showSizeChanger={false}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}