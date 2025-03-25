"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface Props {
  content: string;
  setContent: (content: string) => void;
}

export default function TiptapEditor({ content, setContent }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      setContent(editor.getHTML());
    },
  });

  // 초기 content 설정 (마운트 후)
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor]);

  return (
    <div className="border p-3 rounded-md">
      <EditorContent editor={editor} />
    </div>
  );
}