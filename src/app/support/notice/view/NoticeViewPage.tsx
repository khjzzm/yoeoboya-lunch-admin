"use client";

import {useRouter} from "next/navigation";
import {useDeleteNotice, useLikeNotice, useNoticeDetail, useUnlikeNotice,} from "@/lib/api/useSupport";
import {Button, Card, Spin, Tag, Typography,} from "antd";
import {DeleteOutlined, EditOutlined, LikeFilled, LikeOutlined,} from "@ant-design/icons";
import parse from "html-react-parser";
import ReplyComponent from "@/components/ReplyComponent";
import {useAuthStore} from "@/store/useAuthStore";
import {useQueryParamNumber} from "@/lib/hook/useQueryParam";

export const dynamic = "force-dynamic";

const {Title, Text} = Typography;

export default function NoticeViewPage() {
  const {isAdmin} = useAuthStore();
  const router = useRouter();
  const noticeId = useQueryParamNumber("id");
  const {data: notice, isLoading} = useNoticeDetail(noticeId);
  const {mutate: like} = useLikeNotice(noticeId);
  const {mutate: unlike} = useUnlikeNotice(noticeId);
  const {mutate: deleteNotice} = useDeleteNotice();

  if (isLoading || !notice) {
    return <Spin tip="불러오는 중..."/>;
  }

  const statusMap = {
    ACTIVE: { label: "활성", color: "green" },
    INACTIVE: { label: "비활성", color: "red" },
  };
  const status = statusMap[notice.data.status] ?? { label: "알 수 없음", color: "default" };


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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 text-sm text-gray-500">
        <div className="flex flex-col md:flex-row md:gap-4">
          <Text>공지 기간: {notice.data.startDate?.slice(0, 10)} ~ {notice.data.endDate?.slice(0, 10)}</Text>
        </div>
        <div>
          <Tag color={status.color}>{status.label}</Tag>
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
        </div>

        {isAdmin() &&
          <div className="flex gap-2">
            <Button icon={<EditOutlined/>}
                    onClick={() => router.push(`/support/notice/write?noticeId=${notice.data.id}`)}>수정</Button>
            <Button danger icon={<DeleteOutlined/>} onClick={handleDelete}>삭제</Button>
          </div>
        }
      </div>

      <ReplyComponent noticeId={noticeId}></ReplyComponent>
    </div>
  );
}
