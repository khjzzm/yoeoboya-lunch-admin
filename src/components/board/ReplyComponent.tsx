"use client";

import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { Button, Input, Popconfirm, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

import { Pagination, Reply, ReplyCreateRequest } from "@/types";

import Btn from "@/components/common/Btn";

import dayjs from "@/lib/utils/dayjs";

import { useAuthStore } from "@/store/useAuthStore";

const { Text } = Typography;

interface EnhancedReply extends Reply {
  replyInput: string;
  childReplies: Reply[];
}

interface ReplyService {
  useReplies: (boardNo: number) => UseQueryResult<{ list: Reply[]; pagination: Pagination }, Error>;
  useCreateReply: () => UseMutationResult<void, Error, ReplyCreateRequest>;
  useDeleteReply: (boardNo: number) => UseMutationResult<void, Error, number>;
}

interface ReplyComponentProps {
  boardNo: number;
  service: ReplyService;
  writtenByWithdrawnMember?: boolean;
}

export default function ReplyComponent({
  boardNo,
  service,
  writtenByWithdrawnMember = false,
}: ReplyComponentProps) {
  const { user } = useAuthStore();
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState<EnhancedReply[]>([]);
  const [pagination, setPagination] = useState<Pagination>();
  const [activeReplyInputId, setActiveReplyInputId] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const { useReplies, useCreateReply, useDeleteReply } = service;
  const { data, isLoading, refetch } = useReplies(boardNo);
  const { mutate: createReply } = useCreateReply();
  const { mutate: deleteReply } = useDeleteReply(boardNo);

  useEffect(() => {
    if (!data?.list || !data?.pagination) return;

    const allReplies = data.list;
    const pagination = data.pagination;

    const rootReplies = allReplies
      .filter((r) => !r.parentId)
      .map((reply) => ({
        ...reply,
        replyInput: "",
        childReplies: reply.childReplies ?? [],
      }));

    setPagination(pagination);
    setReplies(rootReplies);
  }, [data]);

  const handleCommentSubmit = (content: string, parentReplyId?: number | null) => {
    if (!content.trim() || !user?.loginId) return;

    createReply(
      {
        boardNo,
        loginId: user.loginId,
        content,
        parentReplyId,
      },
      {
        onSuccess: () => {
          setComment(""); // 초기화
        },
      },
    );
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between border-b-2 border-[#29367c] pb-2 mb-4">
        {/* 왼쪽: 전체 댓글 수 */}
        <div className="text-sm font-semibold">
          전체 댓글 <span className="text-red-600">{pagination?.totalElements}</span>개
        </div>

        {/* 오른쪽: 텍스트 메뉴 */}
        <div className="text-xs text-gray-800 space-x-2">
          <button type="button" onClick={() => setIsCollapsed((prev) => !prev)}>
            댓글닫기 {isCollapsed ? "▼" : "▲"}
          </button>
          <button
            onClick={() => refetch()}
            type="button"
            className="text-xs text-[#29367c] hover:underline"
          >
            새로고침 <ReloadOutlined className="ml-0.5 text-[10px]" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <Spin />
      ) : (
        <>
          {replies.length === 0 ? (
            <Text type="secondary">등록된 댓글이 없습니다.</Text>
          ) : (
            <>
              {!isCollapsed &&
                replies.map((parent) => (
                  <div
                    key={parent.replyId}
                    className="mx-2 px-2 py-2 border-b border-gray-300 bg-white"
                  >
                    {/* 상위 댓글 */}
                    <div className="flex justify-between gap-2">
                      <div className="flex-1 text-sm">
                        <div className="flex items-start gap-2 text-gray-700">
                          <span className="min-w-[120px] flex-shrink-0 inline-flex gap-1 items-center">
                            <span>{parent.writer}</span>
                            <span className="text-xs text-gray-400">{parent.ip}</span>
                          </span>
                          {parent.deleted ? (
                            <span className="whitespace-pre-wrap px-4 text-gray-400">
                              삭제된 댓글입니다.
                            </span>
                          ) : (
                            <span
                              className="whitespace-pre-wrap break-all px-4 cursor-pointer"
                              onClick={() =>
                                setActiveReplyInputId((prev) =>
                                  prev === parent.replyId ? null : parent.replyId,
                                )
                              }
                            >
                              {parent.content}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                        <span>{dayjs(parent.date).format("MM.DD HH:mm:ss")}</span>
                        {parent.mine && !parent.deleted && (
                          <Popconfirm
                            title="댓글을 삭제하시겠습니까?"
                            onConfirm={() => deleteReply(parent.replyId)}
                            okText="삭제"
                            cancelText="취소"
                          >
                            <Button type="text" size="small" icon={<DeleteOutlined />} />
                          </Popconfirm>
                        )}
                      </div>
                    </div>

                    {/* 대댓글 목록 */}
                    {parent.childReplies?.filter((c) => !c.deleted).length > 0 && (
                      <div className="mt-4 ml-4 pl-2 py-2 space-y-2 bg-[#fafafa]">
                        {parent.childReplies.map(
                          (child) =>
                            !child.deleted && (
                              <div
                                key={child.replyId}
                                className="flex justify-between items-start border-b-1"
                              >
                                <div className="flex flex-col text-sm flex-1">
                                  <div className="flex items-center gap-1 text-gray-700">
                                    <span className="min-w-[120px] flex-shrink-0 inline-flex gap-1 items-center">
                                      <span>{child.writer}</span>
                                      <span className="text-xs text-gray-400">{child.ip}</span>
                                    </span>
                                    <span className="whitespace-pre-wrap break-all px-4">
                                      {child.content}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 whitespace-nowrap">
                                  <span>{dayjs(child.date).format("MM.DD HH:mm:ss")}</span>
                                  {child.mine && (
                                    <Popconfirm
                                      title="댓글을 삭제하시겠습니까?"
                                      onConfirm={() => deleteReply(child.replyId)}
                                      okText="삭제"
                                      cancelText="취소"
                                    >
                                      <Button type="text" size="small" icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                  )}
                                </div>
                              </div>
                            ),
                        )}
                      </div>
                    )}

                    {/* 대댓글 입력창 */}
                    {activeReplyInputId === parent.replyId && !writtenByWithdrawnMember && (
                      <div className="mt-2 ml-4 pl-4">
                        <Input.TextArea
                          rows={2}
                          placeholder="답글을 작성하세요..."
                          value={parent.replyInput}
                          onChange={(e) =>
                            setReplies((prev) =>
                              prev.map((r) =>
                                r.replyId === parent.replyId
                                  ? { ...r, replyInput: e.target.value }
                                  : r,
                              ),
                            )
                          }
                        />
                        <div className="flex justify-end mt-2">
                          <Btn
                            text="등록"
                            size="small"
                            onClick={() => handleCommentSubmit(parent.replyInput, parent.replyId)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}
        </>
      )}

      {/* 최상위 댓글 입력창 */}
      {writtenByWithdrawnMember ? (
        <div className="mt-8 p-4 border border-[#29367c] rounded-sm bg-gray-50 text-center text-gray-500">
          <Text>탈퇴한 사용자의 게시글에는 댓글을 작성할 수 없습니다.</Text>
        </div>
      ) : (
        <div className="mt-8 border border-[#29367c] rounded-sm bg-gray-50 p-4">
          <div className="flex flex-col md:flex-row gap-2">
            {/* 작성자 (닉네임) + 비밀번호 */}
            <div className="flex flex-col gap-2 w-full md:max-w-[120px] hidden">
              <Input size="middle" placeholder="닉네임" />
              <Input.Password size="middle" placeholder="비밀번호" />
            </div>

            {/* 댓글 입력 영역 */}
            <div className="flex-1">
              <Input.TextArea
                rows={3}
                className="mt-2 h-full"
                placeholder="타인의 권리를 침해하거나 명예를 훼손하는 댓글은 운영원칙 및 관련 법률에 의해 제재를 받을 수 있습니다. Shift+Enter 키를 누르면 줄바꿈이 됩니다."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* 버튼 영역 */}
            <div className="flex flex-col gap-2 md:ml-2 md:flex-row md:items-end">
              <Btn text={"등록"} onClick={() => handleCommentSubmit(comment)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
