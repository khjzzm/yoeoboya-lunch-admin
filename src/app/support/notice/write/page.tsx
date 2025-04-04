import { Suspense } from "react";

import NoticeWritePage from "@/app/support/notice/write/NoticeWritePage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <NoticeWritePage />
    </Suspense>
  );
}
