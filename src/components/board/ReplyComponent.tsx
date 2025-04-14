"use client";

import { DeleteOutlined } from "@ant-design/icons";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { Button, Input, Popconfirm, Spin, Typography } from "antd";
import { useEffect, useState } from "react";

import { Pagination, Reply, ReplyCreateRequest } from "@/types";

import { useAuthStore } from "@/store/useAuthStore";

const { Text, Title } = Typography;

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
  writtenByWithdrawnMember: boolean; // 🔽 추가된 prop
}

export default function ReplyComponent({
  boardNo,
  service,
  writtenByWithdrawnMember,
}: ReplyComponentProps) {
  const { user } = useAuthStore();
  const [comment, setComment] = useState("");
  const [replies, setReplies] = useState<EnhancedReply[]>([]);
  const [pagination, setPagination] = useState<Pagination>();

  const { useReplies, useCreateReply, useDeleteReply } = service;
  const { data, isLoading } = useReplies(boardNo);
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
      <Title level={4}>댓글 {pagination?.totalElements}</Title>

      {isLoading ? (
        <Spin />
      ) : (
        <div className="space-y-6 mt-4">
          {replies.length === 0 ? (
            <Text type="secondary">등록된 댓글이 없습니다.</Text>
          ) : (
            replies.map((parent) => (
              <div key={parent.replyId} className="p-4 border rounded-lg shadow-sm bg-white">
                {/* 부모 댓글 */}
                <div className="flex justify-between items-center">
                  <Text strong>{parent.writer}</Text>
                  {parent.mine && !parent.deleted && (
                    <Popconfirm
                      title="댓글을 삭제하시겠습니까?"
                      onConfirm={() => deleteReply(parent.replyId)}
                      okText="삭제"
                      cancelText="취소"
                    >
                      <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  )}
                </div>

                {parent.deleted ? (
                  <Text type="secondary">삭제된 댓글입니다.</Text>
                ) : (
                  <div className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">
                    {parent.content}
                  </div>
                )}

                {/* 대댓글 목록 */}
                {parent.childReplies.filter((child) => !child.deleted).length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                    {parent.childReplies
                      .filter((child) => !child.deleted)
                      .map((child) => (
                        <div key={child.replyId} className="ml-2">
                          <div className="flex justify-between items-center">
                            <Text strong>{child.writer}</Text>
                            {child.mine && (
                              <Popconfirm
                                title="댓글을 삭제하시겠습니까?"
                                onConfirm={() => deleteReply(child.replyId)}
                                okText="삭제"
                                cancelText="취소"
                              >
                                <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                              </Popconfirm>
                            )}
                          </div>
                          <div className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                            {child.content}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* 대댓글 입력창 - 탈퇴 회원이면 표시 X */}
                {!writtenByWithdrawnMember && (
                  <div className="mt-4 pl-4">
                    <Input.TextArea
                      rows={2}
                      placeholder="답글을 작성하세요..."
                      value={parent.replyInput}
                      onChange={(e) =>
                        setReplies((prev) =>
                          prev.map((r) =>
                            r.replyId === parent.replyId ? { ...r, replyInput: e.target.value } : r,
                          ),
                        )
                      }
                    />
                    <div className="flex justify-end mt-2">
                      <Button
                        size="small"
                        type="primary"
                        onClick={() => handleCommentSubmit(parent.replyInput, parent.replyId)}
                      >
                        답글 등록
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 최상위 댓글 입력창 */}
      {writtenByWithdrawnMember ? (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50 text-center text-gray-500">
          <Text>탈퇴한 사용자의 게시글에는 댓글을 작성할 수 없습니다.</Text>
        </div>
      ) : (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50">
          <Text strong>댓글 작성</Text>
          <Input.TextArea
            rows={3}
            className="mt-2"
            placeholder="댓글을 입력하세요..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button type="primary" onClick={() => handleCommentSubmit(comment)}>
              댓글 등록
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
