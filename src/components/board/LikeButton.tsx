import { LikeFilled, LikeOutlined } from "@ant-design/icons";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";

import Btn from "@/components/common/Btn";

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
    <Btn
      text="좋아요"
      visual={hasLiked ? "primary" : "outline"}
      icon={hasLiked ? <LikeFilled /> : <LikeOutlined />}
      onClick={handleLike}
    />
  );
}
