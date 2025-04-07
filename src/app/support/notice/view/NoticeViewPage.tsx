"use client";

import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Card, Skeleton, Tag, Typography } from "antd";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";

import { LikeButton } from "@/components/board/LikeButton";
import ReplyComponent from "@/components/board/ReplyComponent";

import { useQueryParamNumber } from "@/lib/hooks/useQueryParam";
import {
  useNoticeDetail,
  useDeleteNotice,
  useLikeNotice,
  useUnlikeNotice,
  useNoticeReplies,
  useNoticeCreateReply,
  useNoticeDeleteReply,
} from "@/lib/queries";

import { useAuthStore } from "@/store/useAuthStore";

export const dynamic = "force-dynamic";

const { Title, Text } = Typography;

export default function NoticeViewPage() {
  const { isAdmin } = useAuthStore();
  const router = useRouter();
  const boardNo = useQueryParamNumber("boardNo");

  const { data: boardData, isLoading } = useNoticeDetail(boardNo);
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

  if (isLoading || !boardData) {
    return <Skeleton active paragraph={{ rows: 8 }} />;
  }

  const statusMap = {
    ACTIVE: { label: "활성", color: "green" },
    INACTIVE: { label: "비활성", color: "red" },
  };
  const status = statusMap[boardData.data.status] ?? { label: "알 수 없음", color: "default" };

  return (
    <div className="max-w-4xl mx-auto">
      <Title level={2}>{boardData.data.title}</Title>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 text-sm text-gray-500">
        <div className="flex flex-col md:flex-row md:gap-4">
          <Text>
            공지 기간: {boardData.data.startDate?.slice(0, 10)} ~{" "}
            {boardData.data.endDate?.slice(0, 10)}
          </Text>
        </div>
        <div>
          <Tag color={status.color}>{status.label}</Tag>
        </div>
      </div>

      <Card>
        <div className="prose max-w-none">{parse(boardData.data.content)}</div>
      </Card>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <LikeButton boardNo={boardNo} hasLiked={boardData.data.hasLiked} service={likeService} />
        </div>

        {isAdmin() && (
          <div className="flex gap-2">
            <Button
              icon={<EditOutlined />}
              onClick={() => router.push(`/support/notice/write?boardNo=${boardData.data.boardId}`)}
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
          </div>
        )}
      </div>

      <ReplyComponent boardNo={boardNo} service={replyService} />
    </div>
  );
}
