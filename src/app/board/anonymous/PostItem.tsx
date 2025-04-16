import { MoreOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps } from "antd";
import dayjs from "dayjs";
import React from "react";

import { AnonymousBoardResponse } from "@/types";

interface Props {
  post: AnonymousBoardResponse;
  inViewRef?: (node?: Element | null) => void;
  onReport: (arg: { boardId: number }) => void;
  onDelete: (arg: { boardId: number; password: string }) => void;
}

function PostItem({ post, inViewRef, onReport, onDelete }: Props) {
  const menuItems: MenuProps["items"] = [
    {
      key: "report",
      label: <span onClick={() => onReport({ boardId: post.boardId })}>🚩 신고</span>,
    },
    {
      key: "delete",
      label: (
        <span onClick={() => onDelete({ boardId: post.boardId, password: "1234" })}>🗑️ 삭제</span>
      ),
    },
  ];

  return (
    <div ref={inViewRef} className="p-4">
      <div className="text-xs text-gray-500 mb-2 flex justify-between items-center">
        <div>
          {post.nickname} | {dayjs(post.createdDate).format("MM.DD HH:mm:ss")}
        </div>
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      </div>
      <div className="whitespace-pre-wrap break-words text-gray-800">{post.content}</div>
    </div>
  );
}

export default React.memo(PostItem);
