import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, MenuProps, message } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

import { AnonymousBoardResponse } from "@/types";

import Btn from "@/components/common/Btn";

import {
  useDeleteAnonymousBoard,
  useLikeAnonymousBoard,
  useReportAnonymousBoard,
} from "@/lib/queries";

import { useAnonymousStore } from "@/store/anonymousStore";

interface Props {
  post: AnonymousBoardResponse;
  inViewRef?: (node?: Element | null) => void;
}

function AnonymousPost({ post, inViewRef }: Props) {
  const { setContentToWrite } = useAnonymousStore();

  const [showDeleteInput, setShowDeleteInput] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showReportInput, setShowReportInput] = useState(false);
  const [reportReason, setReportReason] = useState("");

  const { mutate: reportPost } = useReportAnonymousBoard();
  const { mutate: deletePost } = useDeleteAnonymousBoard();
  const { mutate: likePost, isPending: liking } = useLikeAnonymousBoard(post.boardId);

  const handleLike = () => {
    if (!liking) likePost();
  };

  const handleDeleteConfirm = () => {
    if (!deletePassword.trim()) {
      message.warning("비밀번호를 입력해주세요.");
      return;
    }
    deletePost({ boardId: post.boardId, password: deletePassword });
    setShowDeleteInput(false);
  };

  const handleReportConfirm = () => {
    if (!reportReason.trim()) {
      message.warning("신고 사유를 입력해주세요.");
      return;
    }
    reportPost({ boardId: post.boardId, reason: reportReason });
    setShowReportInput(false);
  };

  const menuItems: MenuProps["items"] = [
    {
      key: "delete",
      label: <span onClick={() => setShowDeleteInput((prev) => !prev)}>🗑️ 삭제</span>,
    },
  ];

  const deleteRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showDeleteInput && deleteRef.current && !deleteRef.current.contains(e.target as Node)) {
        setShowDeleteInput(false);
      }

      if (showReportInput && reportRef.current && !reportRef.current.contains(e.target as Node)) {
        setShowReportInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDeleteInput, showReportInput]);

  return (
    <div ref={inViewRef} className="p-4 border-b hover:bg-gray-50 transition-colors duration-200">
      {/* 글번호 / 작성자 / 시간 / 삭제 시간 / 메뉴 */}
      <div className="text-xs text-gray-500 mb-2 flex justify-between items-center">
        <div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`#${post.boardId}`);
              setContentToWrite(`#${post.boardId}`);
            }}
            className="hover:underline hover:text-blue-500 transition-all"
            title="클릭 시 복사 및 인용 작성"
          >
            #{post.boardId}
          </button>{" "}
          |{" "}
          <span className={post.nickname ? "text-gray-800 font-medium" : ""}>
            {post.nickname || "익명"}
          </span>{" "}
          | {dayjs(post.createdDate).format("MM.DD HH:mm")}
          {post.remainingTime && (
            <>
              {" "}
              | <span className="text-red-400">{post.remainingTime}</span>
            </>
          )}
        </div>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
      {/* 내용 */}
      <div className="whitespace-pre-wrap break-words text-gray-800 mb-2">{post.content}</div>

      {/* 좋아요 / 신고 수 */}
      <div className="text-xs text-gray-400 flex gap-4 items-center mt-2">
        <button onClick={handleLike} disabled={liking} className="hover:text-blue-500 transition">
          👍<span className="pl-1">{post.likeCount}</span>
        </button>
        <button
          onClick={() => setShowReportInput((prev) => !prev)}
          className="hover:text-red-500 transition"
        >
          👎<span className="pl-1">{post.reportCount}</span>
        </button>
      </div>

      {/* 신고 입력 */}
      {showReportInput && (
        <div ref={reportRef} className="mt-3 flex gap-2 items-center">
          <Input
            size="small"
            placeholder="신고 사유를 입력해주세요"
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            className="max-w-[300px]"
          />
          <Btn visual="danger" size="small" text="신고" onClick={handleReportConfirm} />
        </div>
      )}

      {/* 삭제 입력 */}
      {showDeleteInput && (
        <div ref={deleteRef} className="mt-3 flex gap-2 items-center">
          <Input.Password
            size="small"
            placeholder="비밀번호 입력"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="max-w-[300px]"
          />
          <Btn visual="danger" size="small" text="삭제" onClick={handleDeleteConfirm} />
        </div>
      )}
    </div>
  );
}

export default React.memo(AnonymousPost);
