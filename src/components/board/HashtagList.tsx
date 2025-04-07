"use client";

import React from "react";

interface HashtagListProps {
  hashtags: { tag: string }[] | string[];
}

export default function HashtagList({ hashtags }: HashtagListProps) {
  if (!hashtags || hashtags.length === 0) return null;

  const tagList =
    typeof hashtags[0] === "string"
      ? (hashtags as string[])
      : (hashtags as { tag: string }[]).map((t) => t.tag);

  return (
    <div className="mt-4 flex flex-wrap gap-2 text-blue-500 text-sm">
      {tagList.map((tag) => (
        <span key={tag}>#{tag}</span>
      ))}
    </div>
  );
}
