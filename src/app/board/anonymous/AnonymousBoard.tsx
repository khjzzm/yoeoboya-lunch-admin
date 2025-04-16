"use client";

import { Input, Select, Button, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { AnonymousBoardCreate } from "@/types";

import {
  useCreateAnonymousBoard,
  useDeleteAnonymousBoard,
  useDetectNewAnonymousPost,
  useHandleAnonymousNewPostClick,
  useInfiniteAnonymousBoards,
  useReportAnonymousBoard,
  useResetAnonymousBoardToFirstPage,
} from "@/lib/queries/";
import { getOrCreateAnonymousUUID } from "@/lib/utils/uuid";

import PostItem from "./PostItem";

export default function AnonymousBoardPage() {
  useResetAnonymousBoardToFirstPage();
  const uuid = getOrCreateAnonymousUUID();
  const { ref: inViewRef, inView } = useInView();
  const [nickname, setNickname] = useState("익명");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [deleteAt, setDeleteAt] = useState("");

  const { hasNewPost, clear } = useDetectNewAnonymousPost(uuid);

  const { mutate: createPost, isPending } = useCreateAnonymousBoard();
  const { mutate: reportPost } = useReportAnonymousBoard();
  const { mutate: deletePost } = useDeleteAnonymousBoard();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteAnonymousBoards(10);
  const handleClick = useHandleAnonymousNewPostClick(refetch, clear);

  const posts = data?.pages.flatMap((page) => page.list) ?? [];

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleCreate = () => {
    if (!content.trim()) return;

    const payload: AnonymousBoardCreate = {
      content,
      nickname,
      password,
      deleteAt: deleteAt || undefined,
      clientUUID: uuid,
    };

    createPost(payload, {
      onSuccess: () => setContent(""),
    });
  };

  const deleteOptions = [
    { label: "10분", value: 10 },
    { label: "30분", value: 30 },
    { label: "1시간", value: 60 },
    { label: "1일", value: 1440 },
  ];

  return (
    <div className="mx-auto px-4 py-6 text-sm">
      {/* 🔔 새 글 알림 */}

      {hasNewPost && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow cursor-pointer z-50"
          onClick={handleClick}
        >
          🔄 새로운 글이 있어요! 클릭해서 보기
        </div>
      )}

      {/* ✍️ 작성 영역 */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-3 text-xs text-gray-500">
          <Input
            size="small"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="flex-1"
          />
          <Input.Password
            size="small"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1"
          />
          <Select
            size="small"
            placeholder="삭제 예약"
            options={deleteOptions}
            className="flex-1 min-w-[150px]"
            onChange={(min) => setDeleteAt(dayjs().add(min, "minute").toISOString())}
          />
        </div>

        <textarea
          rows={3}
          placeholder="하고 싶은 말을 익명으로 남겨보세요."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border-none bg-transparent resize-none focus:outline-none"
        />

        <div className="flex justify-end mt-2">
          <Button type="primary" shape="round" onClick={handleCreate} loading={isPending}>
            등록
          </Button>
        </div>
      </div>

      {/* 📜 게시글 목록 */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200">
        {posts.map((post, index) => (
          <PostItem
            key={`${post.boardId}-${index}`}
            post={post}
            inViewRef={index === posts.length - 1 ? inViewRef : undefined}
            onReport={reportPost}
            onDelete={deletePost}
          />
        ))}
        <div ref={inViewRef} className="h-1" />
        {(isLoading || isFetchingNextPage) && <Spin className="block mx-auto mt-4" />}
      </div>
    </div>
  );
}
