"use client";

import { LockOutlined } from "@ant-design/icons";
import { Input, Skeleton, Space, Typography } from "antd";
import dayjs from "dayjs";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import HashtagList from "@/components/board/HashtagList";
import { LikeButton } from "@/components/board/LikeButton";
import ReplyComponent from "@/components/board/ReplyComponent";
import Btn from "@/components/common/Btn";

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

const { Title } = Typography;

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

  if (detail.secret && !detail.checkedPin) {
    return (
      <div className="max-w-md mx-auto m-20 text-center">
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
        <Btn text={"확인"} type="primary" onClick={handlePinCheck} />
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
    <div className="max-w-7xl mx-auto px-2 md:px-0">
      <Title level={3} className="text-base font-semibold mb-2">
        [{detail.category}] {detail.title}
      </Title>

      <div className="flex flex-wrap items-center pb-3 gap-x-2 gap-y-1">
        {/* 작성자 */}
        <span className="flex items-center gap-1"> {detail.name} </span>

        {/* 구분점 */}
        <span className="text-gray-300">|</span>

        {/* 작성일 */}
        <span>{dayjs(detail.createdDate).format("YYYY.MM.DD HH:mm:ss")}</span>

        {/* 조회수 */}
        <span className="text-gray-400 ml-auto">
          조회 <span className="text-black font-medium">{detail.viewCount}</span>
        </span>

        {/* 추천 */}
        <span className="text-gray-300">|</span>
        <span className="text-gray-400">
          추천 <span className="text-black font-medium">{detail.likeCount}</span>
        </span>

        {/* 댓글 수 (버튼처럼 둥글게 강조) */}
        <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-xs">
          댓글 {detail.replyCount}
        </span>
      </div>

      {detail.writtenByWithdrawnMember && (
        <div className="mb-4 px-4 py-3 border border-gray-300 bg-gray-50 text-sm text-gray-500 rounded">
          🚫 이 글은 <strong className="text-gray-700">탈퇴한 사용자</strong>가 작성한 게시글입니다.
        </div>
      )}

      <div className="prose max-w-none border-t pt-6">{parse(detail.content || "")}</div>

      <HashtagList hashtags={detail.hashTag} />

      <div className="mt-8 flex justify-between items-center border-t pt-6">
        <LikeButton boardNo={boardNo} hasLiked={detail.hasLiked} service={likeService} />
        {(isAdmin() || detail.mine) && (
          <Space>
            <Btn
              text="수정"
              onClick={() => router.push(`/board/free/write?boardNo=${detail.boardNo}`)}
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

      <ReplyComponent
        boardNo={boardNo}
        service={replyService}
        writtenByWithdrawnMember={detail.writtenByWithdrawnMember}
      />
    </div>
  );
}
