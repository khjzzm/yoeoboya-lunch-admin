"use client";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Skeleton, Typography, Space } from "antd";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import React from "react";

import HashtagList from "@/components/board/HashtagList";
import { LikeButton } from "@/components/board/LikeButton";
import ReplyComponent from "@/components/board/ReplyComponent";

import { useQueryParamNumber } from "@/lib/hooks/useQueryParam";
import {
  useFreeBoardDetail,
  useDeleteFreeBoard,
  useLikeFreeBoard,
  useUnlikeFreeBoard,
  useFreeBoardReplies,
  useFreeBoardCreateReply,
  useFreeBoardDeleteReply,
} from "@/lib/queries";

import { useAuthStore } from "@/store/useAuthStore";

const { Title, Text } = Typography;

export default function FreeViewPage() {
  const { isAdmin } = useAuthStore();
  const router = useRouter();
  const boardNo = useQueryParamNumber("boardNo");

  const { data: boardData, isLoading } = useFreeBoardDetail(boardNo);
  const { mutate: deleteBoard } = useDeleteFreeBoard(boardNo);
  const likeService = {
    useLike: useLikeFreeBoard,
    useUnlike: useUnlikeFreeBoard,
  };
  const replyService = {
    useReplies: useFreeBoardReplies,
    useCreateReply: useFreeBoardCreateReply,
    useDeleteReply: useFreeBoardDeleteReply,
  };

  if (isLoading || !boardData) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  const data = boardData.data;

  return (
    <div className="max-w-4xl mx-auto">
      <Title level={2}>{data.title}</Title>

      <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
        <div>
          카테고리: <Text>{data.category}</Text>
        </div>
        <div>
          작성일: <Text>{data.createdDate?.slice(0, 10)}</Text>
        </div>
      </div>

      <div className="prose max-w-none border-t pt-6">{parse(data.content || "")}</div>

      <HashtagList hashtags={data.hashTag} />

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <LikeButton boardNo={boardNo} hasLiked={data.hasLiked} service={likeService} />
        {(isAdmin() || data.mine) && (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => router.push(`/board/free/write?boardNo=${data.boardNo}`)}
            >
              수정
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                if (confirm("정말 삭제하시겠습니까?")) {
                  deleteBoard();
                }
              }}
            >
              삭제
            </Button>
          </Space>
        )}
      </div>

      <div className="mt-10">
        <ReplyComponent boardNo={boardNo} service={replyService} />
      </div>
    </div>
  );
}
