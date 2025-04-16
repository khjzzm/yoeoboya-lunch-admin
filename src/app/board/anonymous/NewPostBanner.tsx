"use client";

import React from "react";

interface Props {
  visible: boolean;
  onClick: () => void;
}

export default function NewPostBanner({ visible, onClick }: Props) {
  if (!visible) return null;

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded shadow cursor-pointer z-50"
      onClick={onClick}
    >
      🔄 새로운 글이 있어요! 클릭해서 보기
    </div>
  );
}
