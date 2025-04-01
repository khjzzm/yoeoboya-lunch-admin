import {Button} from "antd";
import React from "react";
import {LikeFilled, LikeOutlined} from "@ant-design/icons";
import {UseMutationResult} from "@tanstack/react-query";

/** 외부에서 주입받는 댓글 서비스 인터페이스 */
interface LikeService {
  useLike: (id: number) => UseMutationResult<void, Error, void, unknown>;
  useUnlike: (id: number) => UseMutationResult<void, Error, void, unknown>;
}

interface LikeButtonProps {
  boardId: number;
  hasLiked: boolean;
  service: LikeService;
}

export function LikeButton({boardId, hasLiked, service}: LikeButtonProps) {
  const {mutate: like} = service.useLike(boardId);
  const {mutate: unlike} = service.useUnlike(boardId);
  const handleLike = () => (hasLiked ? unlike : like)();

  return (
    <Button
      type={hasLiked ? "primary" : "default"}
      icon={hasLiked ? <LikeFilled/> : <LikeOutlined></LikeOutlined>}
      onClick={handleLike}
    >
      좋아요
    </Button>
  );
}