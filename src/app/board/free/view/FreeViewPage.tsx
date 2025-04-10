"use client";

import { DeleteOutlined, EditOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Input, Skeleton, Space, Typography } from "antd";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import HashtagList from "@/components/board/HashtagList";
import { LikeButton } from "@/components/board/LikeButton";
import ReplyComponent from "@/components/board/ReplyComponent";

import { useQueryParamNumber, useQueryParamString } from "@/lib/hooks/useQueryParam";
import {
  useDeleteFreeBoard,
  useFreeBoardCreateReply,
  useFreeBoardDeleteReply,
  useFreeBoardDetail,
  useFreeBoardReplies,
  useFreeBoardVerifyPassword,
  useLikeFreeBoard,
  useUnlikeFreeBoard,
} from "@/lib/queries";
import { markAsRead } from "@/lib/utils/readHistory";

import { useAuthStore } from "@/store/useAuthStore";

const { Title, Text } = Typography;

export default function FreeViewPage() {
  const { isAdmin } = useAuthStore();
  const router = useRouter();
  const pin = useQueryParamString("pin") || undefined;
  const boardNo = useQueryParamNumber("boardNo");
  const { data: detail, isLoading } = useFreeBoardDetail(boardNo, pin);
  const { mutate: deleteBoard } = useDeleteFreeBoard(boardNo);
  const verifyPassword = useFreeBoardVerifyPassword();

  const likeService = {
    useLike: useLikeFreeBoard,
    useUnlike: useUnlikeFreeBoard,
  };
  const replyService = {
    useReplies: useFreeBoardReplies,
    useCreateReply: useFreeBoardCreateReply,
    useDeleteReply: useFreeBoardDeleteReply,
  };

  const [inputPin, setInputPin] = useState<string>("");

  if (isLoading || !detail) {
    return <Skeleton active paragraph={{ rows: 6 }} />;
  }

  if (detail.secret && !pin) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center">
        <LockOutlined style={{ fontSize: 40, color: "#888" }} />
        <p className="mt-4 mb-2">비밀글입니다. 비밀번호를 입력해주세요.</p>
        <Input.Password
          placeholder="비밀번호를 입력하세요"
          maxLength={4}
          value={inputPin}
          onChange={(e) => setInputPin(e.target.value)}
          onPressEnter={handlePinCheck}
          style={{ width: 200, marginBottom: 12 }}
        />
        <Button type="primary" onClick={handlePinCheck}>
          확인
        </Button>
      </div>
    );
  }

  function handlePinCheck() {
    verifyPassword.mutate(
      { boardNo, password: inputPin },
      {
        onSuccess: () => {
          router.replace(`/board/free/view?boardNo=${boardNo}&pin=${inputPin}`);
          markAsRead(boardNo);
        },
      },
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Title level={2}>{detail.title}</Title>

      <div className="flex flex-col gap-2 text-sm text-gray-500 mb-4">
        <div>
          카테고리: <Text>{detail.category}</Text>
        </div>
        <div>
          작성일: <Text>{detail.createdDate?.slice(0, 10)}</Text>
        </div>
      </div>

      <div className="prose max-w-none border-t pt-6">{parse(detail.content || "")}</div>

      <HashtagList hashtags={detail.hashTag} />

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <LikeButton boardNo={boardNo} hasLiked={detail.hasLiked} service={likeService} />
        {(isAdmin() || detail.mine) && (
          <Space>
            <Button
              icon={<EditOutlined />}
              onClick={() => router.push(`/board/free/write?boardNo=${detail.boardNo}`)}
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
