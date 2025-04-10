"use client";

import { Button, Input, List, Pagination } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  BoardSearchCondition,
  BoardSearchOptions,
  BoardSearchType,
  FreeBoardResponse,
} from "@/types";

import SearchFilters from "@/components/filters/SearchFilters";

import { usePaginationQuerySync } from "@/lib/hooks/usePaginationQuerySync";
import { useFreeBoards, useFreeBoardVerifyPassword } from "@/lib/queries";
import { isRead, markAsRead } from "@/lib/utils/readHistory";

export default function FreeListPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { page, pageSize, setPagination } = usePaginationQuerySync();
  const { mutate: verifyPassword, isPending } = useFreeBoardVerifyPassword();

  const filters: BoardSearchCondition = useMemo(() => {
    const searchType = searchParams.get("searchType") as BoardSearchType | undefined;
    const keyword = searchParams.get("keyword") || undefined;

    return searchType && keyword ? { searchType, keyword } : {};
  }, [searchParams]);

  const { data, isLoading } = useFreeBoards(page, pageSize, filters);

  const list = data?.list;
  const pagination = data?.pagination;

  const handleSearch = (params: Record<string, string | string[]>) => {
    const [[key, value]] = Object.entries(params);
    const url = new URLSearchParams(searchParams.toString());
    url.set("searchType", key);
    url.set("keyword", value as string);
    url.set("page", "1"); // 검색 시 페이지 초기화
    router.push(`${pathname}?${url.toString()}`);
  };

  const [openPasswordInput, setOpenPasswordInput] = useState<number | null>(null);
  const [password, setPassword] = useState("");

  const handleVerifyAndNavigate = (boardNo: number) => {
    verifyPassword(
      { boardNo, password },
      {
        onSuccess: () => {
          router.push(`/board/free/view?boardNo=${boardNo}&pin=${password}`);
          markAsRead(boardNo);
        },
      },
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <SearchFilters onSearch={handleSearch} filterOptions={BoardSearchOptions} />
        <Button type="primary" onClick={() => router.push("/board/free/write")}>
          글쓰기
        </Button>
      </div>

      {/* ✅ 상단 헤더 */}
      <div className="grid grid-cols-[40px_60px_1fr_100px_100px_60px_60px] py-5 text-xs font-semibold border-b bg-gray-50 gap-1">
        <div className="text-center">번호</div>
        <div className="text-center">카테고리</div>
        <div className="text-center">제목</div>
        <div className="text-center">글쓴이</div>
        <div className="text-center">작성일</div>
        <div className="text-center">조회</div>
        <div className="text-center">추천</div>
      </div>

      <List<FreeBoardResponse>
        loading={isLoading}
        dataSource={list}
        renderItem={(item) => (
          <List.Item
            className="border-b text-xs hover:bg-gray-100 transition-colors"
            style={{ paddingTop: 5, paddingBottom: 5 }}
          >
            <div className="w-full grid grid-cols-[40px_60px_1fr_100px_100px_60px_60px] gap-1">
              <div className="row-span-2 flex justify-center items-center">{item.boardNo}</div>

              <div
                className="row-span-2 flex justify-center items-center text-blue-500 font-medium cursor-pointer"
                onClick={() => handleSearch({ category: item.category })}
              >
                [{item.category}]
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div
                    className={`truncate cursor-pointer hover:underline text-sm`}
                    style={{
                      color: isRead(item.boardNo) ? "#770088" : "black",
                    }}
                    onClick={() => {
                      if (item.secret) {
                        setOpenPasswordInput((prev) =>
                          prev === item.boardNo ? null : item.boardNo,
                        );
                      } else {
                        markAsRead(item.boardNo);
                        router.push(`/board/free/view?boardNo=${item.boardNo}`);
                      }
                    }}
                  >
                    {!item.secret && item.hasFile && <span>📷</span>}
                    {item.secret && "🔒"} {item.title}
                    {item.replyCount > 0 && (
                      <span className="text-gray-400"> ({item.replyCount})</span>
                    )}
                  </div>

                  {openPasswordInput === item.boardNo && (
                    <div className="flex items-center gap-1 ml-2">
                      <Input.Group compact style={{ display: "flex" }}>
                        <Input.Password
                          placeholder="비밀번호"
                          maxLength={4}
                          size="small"
                          style={{ width: 140 }}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onPressEnter={() => handleVerifyAndNavigate(item.boardNo)}
                        />
                        <Button
                          size="small"
                          type="primary"
                          onClick={() => handleVerifyAndNavigate(item.boardNo)}
                          disabled={isPending}
                        >
                          확인
                        </Button>
                      </Input.Group>
                    </div>
                  )}
                </div>

                {item.hashTag?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1 text-gray-400">
                    {item.hashTag.map((tagObj) => (
                      <span
                        key={tagObj.tag}
                        className="cursor-pointer"
                        onClick={() => handleSearch({ hashtag: tagObj.tag })}
                      >
                        #{tagObj.tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="row-span-2 flex justify-center items-center truncate cursor-pointer hover:underline">
                <span onClick={() => handleSearch({ author: item.name })}>{item.name}</span>
              </div>

              <div className="row-span-2 flex justify-center items-center">
                {dayjs(item.createdDate).format("YY.MM.DD HH:mm")}
              </div>

              <div className="row-span-2 flex justify-center items-center">{item.viewCount}</div>

              <div className="row-span-2 flex justify-center items-center">{item.likeCount}</div>
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
          pageSizeOptions={["20", "30", "50"]}
          locale={{ items_per_page: "개" }}
        />
      </div>
    </div>
  );
}
