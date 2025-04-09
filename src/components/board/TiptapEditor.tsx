"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Form, message, Spin } from "antd";
import { useEffect, useRef, useState } from "react";

import { Toolbar } from "./Toolbar";

interface Props {
  content: string;
  setContent: (content: string) => void;
  uploadToS3: (file: File) => Promise<string | null>;
}

export default function TiptapEditor({ content, setContent, uploadToS3 }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dragCounter = useRef(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder: "내용을 입력하세요..." }),
    ],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "focus:outline-none px-2 py-2 max-h-[400px] overflow-y-auto",
      },
      handleKeyDown(view, event) {
        if (event.key === "Tab") {
          view.dispatch(view.state.tr.insertText("\t"));
          return true;
        }
        return false;
      },
      handleDOMEvents: {
        drop: (_view, event: DragEvent) => {
          const hasFiles = event?.dataTransfer?.files?.length;
          if (!hasFiles) return false;

          event.preventDefault();

          const files = Array.from(event.dataTransfer!.files);
          const imageFiles = files.filter((file) => file.type.startsWith("image/"));

          if (imageFiles.length === 0) return false;

          // 비동기 로직을 따로 처리
          (async () => {
            setIsDragging(true);
            setIsUploading(true);

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

            if (insertions.length > 0 && editor) {
              editor.chain().focus().insertContent(insertions).run();
            }

            dragCounter.current = 0;
            setIsDragging(false);
          })();

          return true;
        },
        dragenter: () => {
          dragCounter.current++;
          if (dragCounter.current === 1) setIsDragging(true);
          return false;
        },
        dragleave: () => {
          dragCounter.current--;
          if (dragCounter.current <= 0) {
            dragCounter.current = 0;
            setIsDragging(false);
          }
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <Form.Item name="content" label="본문" className="!w-full" style={{ width: "100%" }}>
      <div className="relative border rounded-md w-full min-h-[300px]">
        {isDragging && (
          <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center border-2 border-dashed border-blue-400 rounded-md pointer-events-none">
            {isUploading ? (
              <>
                <Spin size="large" />
                <p className="text-blue-500 font-medium mt-4">이미지를 업로드 중입니다...</p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-blue-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-blue-600 font-medium text-sm">
                  텍스트 혹은 사진을 여기로 내려놓으세요
                </p>
              </>
            )}
          </div>
        )}

        {/* 툴바 */}
        {editor && <Toolbar editor={editor} uploadToS3={uploadToS3} />}

        {/* 에디터 */}
        <EditorContent editor={editor} className="w-full leading-relaxed [&_p]:mb-0 caret-black" />
      </div>
    </Form.Item>
  );
}
