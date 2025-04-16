"use client";

import { Spin } from "antd";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import {
  useDetectNewAnonymousPost,
  useHandleAnonymousNewPostClick,
  useInfiniteAnonymousBoards,
  useResetAnonymousBoardToFirstPage,
} from "@/lib/queries/";

import AnonymousPost from "./AnonymousPost";
import AnonymousWrite from "./AnonymousWrite";
import NewPostBanner from "./NewPostBanner";

export default function Page() {
  useResetAnonymousBoardToFirstPage();
  const { ref: inViewRef, inView } = useInView();
  const { hasNewPost, clear } = useDetectNewAnonymousPost();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } =
    useInfiniteAnonymousBoards(10);
  const posts = data?.pages.flatMap((page) => page.list) ?? [];
  const handleNewPostClick = useHandleAnonymousNewPostClick(refetch, clear);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage().then();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="mx-auto px-4 py-6 text-sm">
      {/* 신규 게시글 알림 팝업 */}
      <NewPostBanner visible={hasNewPost} onClick={handleNewPostClick} />

      {/* 게시글 작성 */}
      <AnonymousWrite />

      {/* 게시글 목록 */}
      {posts.map((post, index) => (
        <AnonymousPost
          key={`${post.boardId}-${index}`}
          post={post}
          inViewRef={index === posts.length - 1 ? inViewRef : undefined}
        />
      ))}
      <div ref={inViewRef} className="h-1" />
      {(isLoading || isFetchingNextPage) && <Spin className="block mx-auto mt-4" />}
    </div>
  );
}
