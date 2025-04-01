"use client";

import { Editor } from "@tiptap/react";
import {
  BoldOutlined,
  LinkOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {Button, message, Space, Tooltip} from "antd";
import {uploadToS3} from "@/lib/queries/useSupport";
import {useState} from "react";

interface Props {
  editor: Editor;
}

export function Toolbar({ editor }: Props) {
  const [uploading, setUploading] = useState(false);

  if (!editor) return null;
  return (
    <div className="border-b px-2 py-1 bg-gray-50 flex gap-2 items-center">
      <Space size="small" wrap>
        <Tooltip title="굵게">
          <Button
            icon={<BoldOutlined />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            type={editor.isActive("bold") ? "primary" : "default"}
          />
        </Tooltip>
        <Tooltip title="링크 추가">
          <Button
            icon={<LinkOutlined />}
            onClick={() => {
              const url = window.prompt("링크 URL을 입력하세요");
              if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }}
          />
        </Tooltip>
        <Tooltip title="이미지 삽입 (URL)">
          <Button
            icon={<PictureOutlined />}
            onClick={() => {
              const url = window.prompt("이미지 URL을 입력하세요");
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
          />
        </Tooltip>
        <Tooltip title="이미지 업로드 (파일)">
          <>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              id="image-upload"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;

                setUploading(true); // 로딩 시작
                const insertions = [];

                for (const file of files) {
                  try {
                    const imageUrl = await uploadToS3(file);
                    if (imageUrl) {
                      insertions.push({
                        type: "image",
                        attrs: { src: imageUrl },
                      });
                    } else {
                      message.error(`${file.name} 업로드 실패`);
                    }
                  } catch (err) {
                    console.error("업로드 에러", err);
                    message.error(`${file.name} 업로드 중 오류 발생`);
                  }
                }

                if (insertions.length > 0) {
                  editor.chain().focus().insertContent(insertions).run();
                }

                setUploading(false); // 로딩 종료
                e.target.value = "";
              }}
            />
            <Button
              icon={<PictureOutlined />}
              onClick={() => {
                document.getElementById("image-upload")?.click();
              }}
              loading={uploading} // 버튼 로딩 표시
            />
          </>
        </Tooltip>
      </Space>
    </div>
  );
}