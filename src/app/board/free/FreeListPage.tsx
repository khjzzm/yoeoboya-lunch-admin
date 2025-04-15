"use client";

import { Input, List, Pagination } from "antd";
import dayjs from "dayjs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import {
  BoardSearchCondition,
  BoardSearchOptions,
  BoardSearchType,
  FreeBoardResponse,
} from "@/types";

import Btn from "@/components/common/Btn";
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
    <div className="max-w-7xl mx-auto px-2 md:px-0 text-sm">
      {/*  상단 헤더 */}
      <div
        className="grid grid-cols-[50px_80px_1fr_100px_100px_60px_60px] py-3 font-semibold border-b bg-gray-50 gap-1"
        style={{ borderTop: "2px solid #29367c", borderBottom: "1px solid #29367c" }}
      >
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
        renderItem={(item, index) => {
          const isLast = list && index === list.length - 1;

          return (
            <List.Item
              className="text-xs hover:bg-gray-100 transition-colors"
              style={{
                paddingTop: 5,
                paddingBottom: 5,
                borderBottom: isLast ? "1px solid #29367c" : undefined,
              }}
            >
              <div className="w-full grid grid-cols-[50px_80px_1fr_100px_100px_60px_60px] gap-1 text-sm">
                <div className="row-span-2 flex justify-center items-center">{item.boardNo}</div>

                <div
                  className="row-span-2 flex justify-center items-center cursor-pointer"
                  onClick={() => handleSearch({ category: item.category })}
                >
                  {item.category}
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <div
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
                      {item.secret ? (
                        <span className="mr-1">🔒</span>
                      ) : item.hasFile ? (
                        <span className="mr-1">📷</span>
                      ) : (
                        <span className="mr-1">💬</span>
                      )}
                      {!item.writtenByWithdrawnMember ? (
                        <span className="cursor-pointer hover:underline">{item.title}</span>
                      ) : (
                        <span className="cursor-pointer hover:underline">{item.title}</span>
                      )}
                      {item.replyCount > 0 && (
                        <span className="text-xs text-orange-600 ml-1">[{item.replyCount}]</span>
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
                          <Btn
                            text={"확인"}
                            size="small"
                            type="primary"
                            onClick={() => handleVerifyAndNavigate(item.boardNo)}
                            disabled={isPending}
                          />
                        </Input.Group>
                      </div>
                    )}
                  </div>

                  {item.hashTag?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-1 text-gray-400 text-xs">
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

                <div className="row-span-2 flex justify-center items-center cursor-pointer hover:underline">
                  <span onClick={() => handleSearch({ author: item.name })}>{item.name}</span>
                </div>

                <div className="row-span-2 flex justify-center items-center">
                  {dayjs(item.createdDate).format("HH:mm")}
                </div>

                <div className="row-span-2 flex justify-center items-center">{item.viewCount}</div>

                <div className="row-span-2 flex justify-center items-center">{item.likeCount}</div>
              </div>
            </List.Item>
          );
        }}
      />

      <div className="flex items-center justify-between my-4">
        <div className="flex gap-2">
          <Btn text="전체글" onClick={() => router.push("/board/free")} />
          <Btn visual={"outline"} text="개념글" />
        </div>
        <Btn text="글쓰기" onClick={() => router.push("/board/free/write")} />
      </div>

      <div className="flex justify-center my-4">
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

      <div className="flex justify-center">
        <SearchFilters onSearch={handleSearch} filterOptions={BoardSearchOptions} />
      </div>
    </div>
  );
}
