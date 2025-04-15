"use client";

import { Card, Skeleton, Space, Tag, Typography } from "antd";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import React from "react";

import { LikeButton } from "@/components/board/LikeButton";
import ReplyComponent from "@/components/board/ReplyComponent";
import Btn from "@/components/common/Btn";

import { useQueryParamNumber } from "@/lib/hooks/useQueryParam";
import {
  useDeleteNotice,
  useLikeNotice,
  useNoticeCreateReply,
  useNoticeDeleteReply,
  useNoticeDetail,
  useNoticeReplies,
  useUnlikeNotice,
} from "@/lib/queries";

import { useAuthStore } from "@/store/useAuthStore";

export const dynamic = "force-dynamic";

const { Title, Text } = Typography;

export default function NoticeViewPage() {
  const { isAdmin } = useAuthStore();
  const router = useRouter();
  const boardNo = useQueryParamNumber("boardNo");

  const { data: detail, isLoading } = useNoticeDetail(boardNo);
  const { mutate: deleteBoard } = useDeleteNotice(boardNo);
  const likeService = {
    useLike: useLikeNotice,
    useUnlike: useUnlikeNotice,
  };

  const replyService = {
    useReplies: useNoticeReplies,
    useCreateReply: useNoticeCreateReply,
    useDeleteReply: useNoticeDeleteReply,
  };

  if (isLoading || !detail) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const statusMap = {
    ACTIVE: { label: "활성", color: "green" },
    INACTIVE: { label: "비활성", color: "red" },
  };
  const status = statusMap[detail.status] ?? { label: "알 수 없음", color: "default" };

  return (
    <div className="max-w-7xl mx-auto px-2 md:px-0">
      <Title level={2}>{detail.title}</Title>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 text-sm text-gray-500">
        <div className="flex flex-col md:flex-row md:gap-4">
          <Text>
            공지 기간: {detail.startDate?.slice(0, 10)} ~ {detail.endDate?.slice(0, 10)}
          </Text>
        </div>
        <div>
          <Tag color={status.color}>{status.label}</Tag>
        </div>
      </div>

      <Card>
        <div className="prose max-w-none">{parse(detail.content)}</div>
      </Card>

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <LikeButton boardNo={boardNo} hasLiked={detail.hasLiked} service={likeService} />
        {isAdmin() && (
          <Space>
            <Btn
              text="수정"
              onClick={() => router.push(`/support/notice/write?boardNo=${detail.boardNo}`)}
            />
            <Btn
              visual="danger"
              text="삭제"
              onClick={() => {
                if (confirm("정말 삭제하시겠습니까?")) {
                  deleteBoard();
                }
              }}
            />
          </Space>
        )}
      </div>

      <ReplyComponent boardNo={boardNo} service={replyService} />
    </div>
  );
}
