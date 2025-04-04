import { Suspense } from "react";

import NoticeViewPage from "@/app/support/notice/view/NoticeViewPage";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: "2rem", fontSize: "20px" }}>불러오는 중...</div>}>
      <NoticeViewPage />
    </Suspense>
  );
}
