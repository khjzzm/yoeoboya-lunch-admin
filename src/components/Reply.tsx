"use client";

import {useEffect, useState} from "react";
import {useCreateReply, useNoticeReplies} from "@/lib/api/useSupport";
import {Reply} from "@/types/reply";
import {useAuthStore} from "@/store/useAuthStore";
import {Typography, Button, Input, Spin, Popconfirm} from "antd";
import {DeleteOutlined} from "@ant-design/icons";

const {Text, Title} = Typography;

interface EnhancedReply extends Reply {
  replyInput: string;
  childReplies: Reply[];
}

interface ReplyComponentProps {
  noticeId: number;
}

export default function ReplyComponent({noticeId}: ReplyComponentProps) {
  const {user} = useAuthStore();
  const [comment, setComment] = useState("");

  const {data, isLoading} = useNoticeReplies(noticeId);

  const {mutate: createReply} = useCreateReply();

  const [replies, setReplies] = useState<EnhancedReply[]>([]);

  // 부모/자식 댓글 정리
  useEffect(() => {
    if (!data?.data?.list) return;

    const allReplies: Reply[] = data.data.list;

    const parents = allReplies
      .filter(r => !r.parentId)
      .map(p => {
        return {
          ...p,
          replyInput: "",
          childReplies: p.childReplies ?? [],
        };
      });

    console.log("🧾 전체 replies:", allReplies);
    console.log("🧷 부모 replies:", parents);

    setReplies(parents);
  }, [data]);

  const handleCommentSubmit = (content: string, parentReplyId?: number | null) => {
    if (!content.trim() || !user?.loginId) return;

    createReply(
      {
        boardId: noticeId,
        loginId: user.loginId,
        content,
        parentReplyId,
      },
      {
        onSuccess: () => {
          setComment("");
        },
      }
    );
  };

  return (
    <div className="mt-10">
      <Title level={4}>댓글</Title>

      {isLoading ? (
        <Spin/>
      ) : (
        <div className="space-y-6 mt-4">
          {replies.length === 0 ? (
            <Text type="secondary">등록된 댓글이 없습니다.</Text>
          ) : (
            replies.map((parent) => (
              <div
                key={parent.replyId}
                className="p-4 border rounded-lg shadow-sm bg-white"
              >
                <div className="flex justify-between items-center">
                  <Text strong>{parent.writer}</Text>
                  <Popconfirm
                    title="댓글을 삭제하시겠습니까?"
                    // onConfirm={() => handleDeleteReply(parent.replyId)}
                    okText="삭제"
                    cancelText="취소"
                  >
                    <Button size="small" type="text" danger icon={<DeleteOutlined/>}/>
                  </Popconfirm>
                </div>

                <div className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">
                  {parent.content}
                </div>

                {/* 대댓글 리스트 */}
                {parent.childReplies.length > 0 && (
                  <div className="mt-4 space-y-3 pl-4 border-l-2 border-gray-200">
                    {parent.childReplies.map((child) => (
                      <div key={child.replyId} className="ml-2">
                        <div className="flex justify-between items-center">
                          <Text strong>{child.writer}</Text>
                          <Popconfirm
                            title="댓글을 삭제하시겠습니까?"
                            // onConfirm={() => handleDeleteReply(child.replyId)}
                            okText="삭제"
                            cancelText="취소"
                          >
                            <Button size="small" type="text" danger icon={<DeleteOutlined/>}/>
                          </Popconfirm>
                        </div>
                        <div className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">
                          {child.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 대댓글 입력 */}
                <div className="mt-4 pl-4">
                  <Input.TextArea
                    rows={2}
                    placeholder="답글을 작성하세요..."
                    value={parent.replyInput}
                    onChange={(e) => {
                      const updated = replies.map((r) =>
                        r.replyId === parent.replyId
                          ? {...r, replyInput: e.target.value}
                          : r
                      );
                      setReplies(updated);
                    }}
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
              </div>
            ))
          )}
        </div>
      )}

      {/* 최상위 댓글 입력창 */}
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
    </div>
  );
}