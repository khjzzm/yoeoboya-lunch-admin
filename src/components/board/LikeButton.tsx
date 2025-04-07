import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import { UseMutationResult } from "@tanstack/react-query";
import { Button } from "antd";
import React from "react";

/** 외부에서 주입받는 댓글 서비스 인터페이스 */
interface LikeService {
  useLike: (id: number) => UseMutationResult<void, Error, void, unknown>;
  useUnlike: (id: number) => UseMutationResult<void, Error, void, unknown>;
}

interface LikeButtonProps {
  boardNo: number;
  hasLiked: boolean;
  service: LikeService;
}

export function LikeButton({ boardNo, hasLiked, service }: LikeButtonProps) {
  const { mutate: like } = service.useLike(boardNo);
  const { mutate: unlike } = service.useUnlike(boardNo);
  const handleLike = () => (hasLiked ? unlike : like)();

  return (
    <Button
      type={hasLiked ? "primary" : "default"}
      icon={hasLiked ? <LikeFilled /> : <LikeOutlined></LikeOutlined>}
      onClick={handleLike}
    >
      좋아요
    </Button>
  );
}
