"use client";

export const dynamic = "force-dynamic";
import {useSearchParams, useRouter} from "next/navigation";
import { useNoticeDetail, useLikeNotice, useUnlikeNotice, useDeleteNotice, } from "@/lib/api/useSupport";
import { Card, Typography, Tag, Button, Spin, } from "antd";
import { LikeOutlined, LikeFilled, DeleteOutlined, EditOutlined, } from "@ant-design/icons";
import parse from "html-react-parser";
import ReplyComponent from "@/components/ReplyComponent";

const {Title, Text} = Typography;

export default function NoticeViewPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const noticeId = Number(searchParams.get("id"));

  const {data: notice, isLoading} = useNoticeDetail(noticeId);
  const {mutate: like} = useLikeNotice(noticeId);
  const {mutate: unlike} = useUnlikeNotice(noticeId);
  const {mutate: deleteNotice} = useDeleteNotice();


  if (isLoading || !notice) {
    return <Spin tip="불러오는 중..."/>;
  }

  const priorityColor = ["default", "blue", "red"][notice.data.priority] ?? "default";
  const statusLabel = {
    ACTIVE: "활성",
    INACTIVE: "비활성",
  }[notice.data.status];

  const handleLike = () => {
    if (notice.data.hasLiked) {
      unlike()
    } else {
      like();
    }
  };

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      deleteNotice(noticeId);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Title level={2}>{notice.data.title}</Title>
      <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
        <div>
          <Text>작성자: {notice.data.author}</Text>
        </div>
        <div>
          <Tag color={priorityColor}>우선순위 {"낮음 보통 높음".split(" ")[notice.data.priority]}</Tag>
          <Tag>{statusLabel}</Tag>
        </div>
      </div>

      <Card>
        <div className="prose max-w-none">{parse(notice.data.content)}</div>
      </Card>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            type={notice.data.hasLiked ? "primary" : "default"}
            icon={notice.data.hasLiked ? <LikeFilled/> : <LikeOutlined/>}
            onClick={handleLike}
          >
            좋아요 {notice.data.likeCount}
          </Button>
          <Text type="secondary">댓글 {notice.data.replyCount}</Text>
        </div>
        <div className="flex gap-2">
          <Button icon={<EditOutlined/>}
                  onClick={() => router.push(`/support/notice/write?noticeId=${notice.data.id}`)}>수정</Button>
          <Button danger icon={<DeleteOutlined/>} onClick={handleDelete}>삭제</Button>
        </div>
      </div>

      <ReplyComponent noticeId={noticeId}></ReplyComponent>
    </div>
  );
}
