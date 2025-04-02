"use client";

import {useEffect, useRef, useState} from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Toolbar } from "./Toolbar";
import {uploadToS3} from "@/lib/queries/useSupport";
import {message, Spin} from "antd";

interface Props {
  content: string;
  setContent: (content: string) => void;
}

export default function TiptapEditor({ content, setContent }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const dragCounter = useRef(0);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "tiptap-link", // 👈 여기 추가
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
      }
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
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
              <p className="text-blue-600 font-medium text-sm">텍스트 혹은 사진을 여기로 내려놓으세요</p>
            </>
          )}
        </div>
      )}

      {/* 툴바 */}
      {editor && <Toolbar editor={editor} />}

      {/* 에디터 */}
      <EditorContent
        editor={editor}
        className="w-full p-3 min-h-[600px] leading-relaxed [&_p]:mb-0"
      />
    </div>
  );
}